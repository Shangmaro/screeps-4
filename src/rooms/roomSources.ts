//import { NFind } from '../core/find'
//import { NUtil } from '../core/utils'
//import * as ROLE from '../types/roles'
//import { countPartCreep } from '../creeps/body'
import { getAdjacent } from './roomUtils'

export namespace NSource {
    // Should be called when we first see this room.
    export const initSourceData = function(room:Room) {
        const rdata = room.memory;
        const sources = room.find(FIND_SOURCES);
        const len = sources.length;
        if (len === 0) {
            rdata.src = [];
            return;
        }
        const terr = new Room.Terrain(room.name);
        rdata.src = Array(len);
        let totSlots = 0;
        for (let i=0; i<len; ++i) {
            const s = sources[i];
            const sdata = {} as SourceData;
            sdata.id = s.id;
            sdata.slots = getAdjacent(terr, s.pos); // build a list of {x,y}
            let len = sdata.slots.length;
            totSlots += len;
            sdata.size = len;
            sdata.miners = _.fill(Array(len), 0);
            sdata.work = 0; // should be accumulated by miners that attach themselves
            rdata.src[i] = sdata;
        }
        rdata.srcTotSlots = totSlots;
    }

    /*
    // Called at the beginning of "do I need a miner?" since I don't (yet) trust this source.
    // Also called after a nuke hit. Or when some other part of miner-handling pukes.
    //
    // MINE data, not source data, cuz I don't care about sources. I care about miners.
    // Note: init sets everything to zero; it doesn't note miners! This fn notes miners.
    export const auditMineData = function(room:Room) {
        const rdata = room.memory;

        // basic checks
        const sources = room.find(FIND_SOURCES);
        if (rdata.src===undefined) {
            console.log(' No source-data object in mem for room '+room.name); // not necessarily an error
            initSourceData(room);
        } else if (rdata.src.length !== sources.length) {
            console.log(' Source-data object wrong size for room '+room.name);
            initSourceData(room);
            if (rdata.src.length !== sources.length) {
                global.errlog('initSourceData fails to match number of sources');
                return;
            }
        }

        // build censii
        const miners = NFind.findMyMiners(room);
        console.log(' auditMineData found '+miners.length+' miners');
        const numPerSource = _.fill(Array(4), 0);
        const idsPerSource = [{},{},{},{}] as any[];
        miners.forEach((m) => {
            const mdata = m.memory as MinerMemory;
            if (mdata.snum!=undefined) {
                const snum:number = mdata.snum;
                numPerSource[snum]++;
                (idsPerSource[snum] as any)[m.id]=true;
                }
        });

        // per-source checks
        for (let i=0; i<rdata.src.length; ++i) {
            const sdata = rdata.src[i];
            let err = false;
            let numMiners = NUtil.countNonZero(sdata.miners);
            if (numMiners != numPerSource[i]) {
                let msg = ' Different number of miners at source #'+i+', '+numMiners+' from '+NUtil.stringifyarray(sdata.miners);
                msg += ' & '+numPerSource[i]+' from findMyMiners ('+miners.length+')';
                global.errlog(msg);
                err = true;
            } else {
                for (let jj=0; jj<sdata.miners.length; ++jj) {
                    const mid = sdata.miners[jj];
                    if (mid!==0 && idsPerSource[i][mid]===undefined) {
                        // it's in the miners list, but isn't a creep in the room with this role
                        global.errlog('Miner id '+mid+' in sdata but not found via room find');
                        err = true;
                    }
                }
                for (let mid in idsPerSource[i]) {
                    if (!sdata.miners.includes(mid as Id<Creep>) && !err) {
                        global.errlog('Miner id '+mid+' in room find but not sdata');
                        err = true;
                    }
                }
            }
            if (err) {
                rebuildMinerData(room, i, idsPerSource[i]);
            }
        }
    }

    // Assuming our miners as the source of truth, and keeping to the limits
    // of the source, rebuild data for one source. Any excess miners will be
    // assigned to other sources if space permits, otherwise they'll be sent
    // off to (2,2).
    const rebuildMinerData = function(room:Room, snum:number, idsPerSource:any[]) {
        console.log('Rebuilding data for snum='+snum+', ids='+NUtil.stringifykeys(idsPerSource));

        // go through every miner and unset them
        let miners = [];
        for (const mid in idsPerSource) {
            const miner = Game.getObjectById(mid) as Creep;
            miners.push(miner);
            const cdata = miner.memory as MinerMemory;
            delete cdata.snum;
            cdata.srcx = 2;
            cdata.srcy = 2;
            delete cdata.xid;
            delete cdata.targid;
        }

        // go through the src data and reset it
        const sdata = room.memory.src[snum];
        sdata.work = 0;
        sdata.miners = _.fill(Array(sdata.size), 0);

        // assign each miner anywhere
        for (let i=0; i<miners.length; ++i) {
            const miner = miners[i];
            assignMiner(miner);
            const cdata = miner.memory as MinerMemory;
            if (cdata.srcx==2) {
                global.errlog('rebuilt miner data failed to assign all '+miners.length+' miners');
            }
        }
    }

    // return index of neediest source
    export const haveNeedySource = function(rdata:RoomMemory) {
        for (let i=0; i<rdata.src.length; ++i) {
            const sdata = rdata.src[i];
            const wavail = 5 - sdata.work;
            const numMiners = NUtil.countNonZero(sdata.miners);
            if (numMiners < sdata.size && wavail > 0) {
                // Normally this would be a TRUE right here, but something's buggy.
                // So, double-check.
                const cens = rdata.census[ROLE.MINER];
                let space = 0;
                for (let jj=0; jj<rdata.src.length; ++jj) space += rdata.src[jj].size;
                if (cens < space)
                    return true;
                global.errlog('@@@   bug in haveNeedySource');
                global.errlog('@@@   m='+numMiners+', size='+sdata.size+', census='+cens+', space='+rdata.src[i].size);
                global.errlog('@@@   miners='+NUtil.stringifyarray(sdata.miners));
                return false;
            }
        }
        return false;
    }

    const availMiningSource = function(rdata:RoomMemory) {
        for (let i=0; i<rdata.src.length; ++i) {
            const sdata = rdata.src[i];
            const numMiners = NUtil.countNonZero(sdata.miners);
            if (numMiners < sdata.size)
                return i;
        }
        return -1;
    }

    const nextMiningSource = function(rdata:RoomMemory) {
        let most = -1;
        let value = 0;
        for (let i=0; i<rdata.src.length; ++i) {
            const sdata = rdata.src[i];
            const wavail = 5 - sdata.work;
            const numMiners = NUtil.countNonZero(sdata.miners);
            if (numMiners < sdata.size && wavail > value) {
                most = i;
                value = wavail;
            }
        }
        return most;
    }

    // figure out which slot this miner was put into based upon position
    const whichSlot = function(sdata:SourceData, miner:Creep) {
        for (let i=0; i<sdata.slots.length; ++i) {
            const slot = sdata.slots[i];
            const mdata = miner.memory as MinerMemory;
            if (slot.x==mdata.srcx && slot.y==mdata.srcy)
                return i;
        }
        return -1;
    }

    // find the next open slot on a mine
    const nextOpenSlot = function(sdata:SourceData) {
        for (let i=0; i<sdata.miners.length; ++i) {
            if (sdata.miners[i]===0) return i;
        }
        return -1;
    }

    // returns TRUE if successful
    const attachMiner = function(creep:Creep, snum:number) {
        const cdata = creep.memory as MinerMemory;
        const rdata = creep.room.memory;
        const sdata = rdata.src[snum];

        let slot = -1;
        for (let i=0; i<sdata.size; ++i) {
            if (sdata.miners[i]===0) {
                slot = i;
                break;
            }
        }
        if (slot<0) {
            global.errlog('Miner Attach failed: no open slot available (src='+snum+')');
            delete cdata.snum;
            return false;
        }
        cdata.snum = snum;
        cdata.srcx = sdata.slots[slot].x;
        cdata.srcy = sdata.slots[slot].y;

        //console.log('Attached miner '+creep.name+' to src='+snum+', slot='+slot+' ('+cdata.srcx+','+cdata.srcy+')');
        if (creep.id === undefined) {
            sdata.miners[slot] = '1' as Id<Creep>;
            cdata.slot = slot;
        } else {
            sdata.miners[slot] = creep.id;
        }
        sdata.work += countPartCreep(creep.body, WORK);
        return true;
    }

    // returns TRUE if successful
    export const detachMiner = function(creep:Creep) {
        const cdata = creep.memory as MinerMemory;
        const snum = cdata.snum;
        if (snum===undefined || snum<0) {
            // already detached!
            return;
        }

        // determine slot
        const rdata = creep.room.memory;
        const sdata = rdata.src[snum];
        let slot = -1;
        for (let i=0; i<sdata.size; ++i) {
            if (sdata.miners[i]===creep.id) {
                slot = i;
                break;
            }
        }

        // miner was NOT in the list of assigned miners?!
        if (slot<0) {
            global.errlog('Miner Detach failed: id not found in list (src='+snum+')');
            delete cdata.snum; // undefined means crazy
            cdata.act = 0;
            cdata.srcx = 2;
            cdata.srcy = 2;
            return false;
        }

        // adjust src values
        sdata.miners[slot] = 0;
        sdata.work -= countPartCreep(creep.body, WORK);
        return true;
    }

    // Given a miner with a workroom, find the neediest source and stick him there.
    // If there is no such source, find a source with an open spot.
    // If there is no such source, we should send him next door...
    // ...but for now we send him to 2,2.
    export const assignMiner = function(miner:Creep) {
        const wrname = NUtil.wrname(miner.memory);
        const rdata = Memory.rooms[wrname];
        const mdata = miner.memory as MinerMemory;
        let snum = nextMiningSource(rdata);
        if (snum<0)
            snum = availMiningSource(rdata);
        if (snum<0) {
            global.errlog("Why do we have too many miners?");
            delete mdata.snum; // undefined means crazy.
            mdata.srcx = (miner.pos.x>24) ? 2 : 47;
            mdata.srcy = (miner.pos.y>24) ? 2 : 47;
            return;
        }
        if (attachMiner(miner, snum)) {
            const sdata = rdata.src[snum];
            console.log('Assigned miner '+miner.name+' to snum='+snum+', slot='+whichSlot(sdata, miner));
            console.log(' source has (up to '+sdata.size+') miners: '+NUtil.stringifyarray(sdata.miners));
            return; // success!
        }

        global.errlog("nextMiningSource said this source was free, but nextOpenSlot disagrees??!! wtf!");
        delete mdata.snum;
        mdata.srcx = 2;
        mdata.srcy = 2;
    }

    export const fixupMinerId = function(creep:Creep) {
        const id = creep.id;
        const cdata = creep.memory as MinerMemory;
        if (cdata.snum!=undefined) {
            const rdata = creep.room.memory;
            const sdata = rdata.src[cdata.snum];
            const slot = cdata.slot!;
            const exminer = sdata.miners[slot];
            if (exminer!=='1') {
                global.errlog("miner's reserved slot no longer reserved? name="+creep.name+", snum="+cdata.snum+", slot="+cdata.slot+", m="+exminer);
                assignMiner(creep);
            } else {
                sdata.miners[slot] = id;
                delete cdata.slot;
            }
        } else {
            global.errlog("attempt to fixup miner without an snum? name="+creep.name);
            delete cdata.slot;
        }
    }
    */
}
