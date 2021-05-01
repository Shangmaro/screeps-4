//import { NFriend } from '../core/friends'
//import { NStats } from '../core/stats'
//import { NDefend } from './roomsDefend'
import * as  ROLE from '../types/roles'
//import { NSource } from './roomsSources'
import { doSpawn } from './roomSpawn'
//import * as body from '../creeps/body'

export namespace RBase {
    /*
    const loadT1 = function(room:Room):void {
        if (Memory.t1[room.name]===undefined)
            Memory.t1[room.name] = {} as PerTickRoomData;
        const data = Memory.t1[room.name];
        parseHostiles(room, data);
    }

    const parseHostiles = function(room:Room, data:PerTickRoomData) {
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        data.enemies = [];
        data.nonenemies = [];
        for (let i=0; i<hostiles.length; ++i) {
            const creep = hostiles[i];
            if (NFriend.isEnemy(creep.owner.username))
                data.enemies.push(creep);
            else
                data.nonenemies.push(creep);
        }
    }

    const defendBase = function(room:Room) {
        const rdata = room.memory;
        if (rdata.defcon===5) {
            if (rdata.enemies.length===0) {
                NDefend.friendlyTowers(room);
                return;
            }
            NDefend.defCheck(room);
        }
        // TODO: maybe think about spawning a defender?
        NDefend.enemyTowers(room);
    }
    */

    /*
    const findBestSpawn = function(room:Room) {
        const spawns = room.find(FIND_MY_SPAWNS);
        for (let i=0; i<spawns.length; ++i) {
            const spawn = spawns[i];
            if (!spawn.spawning)
                return spawn;
        }
        return null;
    }

    // This is the spawn *execute*, called per tick.
    // Thinking about what to spawn is baseThinkSpawn, below.
    const baseSpawn = function(room:Room) {
        // did we decide we're full up?
        const rdata = room.memory;
        if (rdata.spawnRole===undefined)
            return;

        // do we have enough energy?
        if (room.energyAvailable < rdata.spawnEnergy)
            return;

        // choose a free Spawn
        const spawn = findBestSpawn(room);
        if (spawn == undefined)
            return;

        // spawn it
        const rv = doSpawn(rdata.spawnBody, rdata.spawnRole, room, spawn, rdata.spawnMemory);
        if (rv===0) {
            console.log(' #### now spawning: memory='+JSON.stringify(rdata.spawnMemory));
            // clear out the request
            delete rdata.spawnRole;
            // this is one of the events where we decide what to do next - cuz we could have multiple spawns
            if (rdata.numSpawns>1)
                rdata.thinkNextTick = true;
        } else {
            // this is exceptional!
            global.errlog('*** FAILURE to spawn, rv='+rv);
        }
    }

    // meh? this should probably go away.
    const spawnLocal = function(bodyType:number, role:number, room:Room) {
        const rdata = room.memory;
        const pow = room.energyAvailable;
        const cap = room.energyCapacityAvailable;
        rdata.spawnBody = body.createType(bodyType, -1, pow, cap);
        rdata.spawnEnergy = body.bodyCost(rdata.spawnBody);
        rdata.spawnRole = role;
        rdata.spawnMemory = {}
    }
    */

    // Should we spawn a defender? Return TRUE if we did.
    const thinkSpawnDefender = function(room:Room, rdata:RoomMemory, spawn:StructureSpawn) {


        // ***** DEBUG *****
        return false;
        // ***** DEBUG *****
/*

        if (rdata.defcon===5) return false;

        // do we need a defender?
        const isOverdog = NDefend.isOverdog(room, rdata);
        if (isOverdog)
            return false;

        // if they're right up on the Spawner, spawn a distractor
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const numOnSpawn = NDefend.numEnemyNearSpawns(room, rdata, hostiles);
        if (numOnSpawn >= 3) {
            spawnLocal(ROLE.DISTRACT, ROLE.DISTRACT, room);
            return true;
        }

        // spawn a defender
        spawnLocal(ROLE.GUARD, ROLE.GUARD, room);
        return true;
*/
    }

    /*
    const needUpgrader = function(room:Room) {
        const rdata = room.memory;
        // if we have too many dudes, no.
        const numup = rdata.census[ROLE.UPGRADE] || 0;
        if (numup >= 4) {
            console.log(' -no- upg cuz have too many ('+numup+')');
            return false;
        }
        // if our container has been growing, yes.
        const cid = rdata.containers.u;
        if (cid!==undefined) {
            // TODO: put check here.
        }
        // else, see if carries have been bored
        if (!(rdata.nextustat>=Game.time)) { // JS logic for undefined, too
            const stat = rdata.carryStats.avg;
            if (stat > 0.5) {
                rdata.nextustat = Game.time + 50;
                console.log(' ++ upg cuz stat='+stat);
                return true;
            } else {
                console.log(' -- upg cuz stat='+stat);
            }
        }
        return false;
    }

    const minMineFreeSpace = 500;
    // If we have full miners, or the mine container has been going up for 200 ticks -> Carry
    // Temporary: if mine container > 1500
    // With 100 storage, a miner gets full every 10 ticks; so in 350 avg = 0.1
    const needCarry = function(room:Room) {
        const rdata = room.memory;
        if (!(rdata.nextcstat>=Game.time)) {
            const stat = NStats.getFloat49(rdata.minerStats);
            if (stat > 0.05) {
                rdata.nextcstat = Game.time + 50;
                console.log(' ++ carry cuz stat='+stat);
                return true;
            } else {
                console.log(' -- carry cuz stat='+stat);
            }
        }
        let cid = rdata.containers.s1 as Id<StructureContainer> | undefined;
        if (cid!==undefined) {
            const cont = Game.getObjectById(cid);
            if (cont!=undefined && cont.store.getFreeCapacity()<minMineFreeSpace)
                return true;
        }
        cid = rdata.containers.s2 as Id<StructureContainer> | undefined;
        if (cid!==undefined) {
            const cont = Game.getObjectById(cid);
            if (cont!=undefined && cont.store.getFreeCapacity()<minMineFreeSpace)
                return true;
        }
        return false;
    }

    const needMiner = function(room:Room) {
        NSource.auditMineData(room); // cuz I don't trust it yet
        return NSource.haveNeedySource(room.memory);
    }
    */

    /*     This old function sucks.

    var findSpotForMinerAt = function(room) {
        const rdata = room.memory;
        const smem = rdata.spawnMemory;
        const snum = smem.snum;
        const sname = 's' + (snum+1);
        smem.xid = rdata.containers[sname];
        const sid = rdata.src[snum].id;
        const source = Game.getObjectById(sid);
        const sx = source.pos.x;
        const sy = source.pos.y;
        const valid = [true,true,true,true,true,true,true,true,true];

        // first make sure no creeps
        const cx = room.lookForAtArea(LOOK_CREEPS, sy-1, sx-1, sy+1, sx+1, true);
        for (let i=0; i<cx.length; ++i) {
            const cc = cx[i];
            if (cc.my && cc.memory.role==ROLE.MINER) {
                const dx = cc.pos.x - sx;
                const dy = cc.pos.y - sy;
                const index = dy*3 + dx + 4;
                valid[index] = false;
            }
        }

        // now make sure no walls
        const terr = room.getTerrain();
        for (let i=0; i<9; ++i) {
            const dy1 = Math.floor(i/3);
            const dx = i - dy1*3 - 1;
            const dy = dy1 - 1;
            if (terr.get(sx+dx, sy+dy) == 1)
                valid[i] = false;
            else {
                // attach this to the already-existing spawnMemory
                smem.srcx = sx+dx;
                smem.srcy = sy+dy;
                return;
            }
        }
        // well this sucks. Fix this eventually?
        errlog("Can't find spot for miner");
    }
    */

    // Need to set: ROLE, BODY, and MEMORY
    // energy requirement = fn(body), will be set outside

    /*
    const requestUpgrader = function(room:Room) {
        const rdata = room.memory;
        // build the body : as large as possible
        const now = room.energyAvailable;
        const cap = room.energyCapacityAvailable;
        const bod = body.createUpgrade(body.BEST_CAP, now, cap);
        // compute memory
        const mem = {};
        // set values
        rdata.spawnRole = ROLE.UPGRADE;
        rdata.spawnBody = bod;
        rdata.spawnMemory = mem;
    }

    const requestCarry = function(room:Room) {
        const rdata = room.memory;
        // build the body : as large as possible
        const now = room.energyAvailable;
        const cap = room.energyCapacityAvailable;
        const bod = body.createCarry(body.BEST_CAP, now, cap);
        // compute memory
        const mem = {};
        // set values
        rdata.spawnRole = ROLE.CARRY;
        rdata.spawnBody = bod;
        rdata.spawnMemory = mem;
    }

    const requestMiner = function(room:Room) {
        const rdata = room.memory;
        // build the body : as large as possible
        const now = room.energyAvailable;
        const cap = room.energyCapacityAvailable;
        const bod = body.createMiner(5, now, cap);
        // compute memory
        const mem = {}; // actual source & slot decided at spawn; without wrname it should use hrname
        // set values
        rdata.spawnRole = ROLE.MINER;
        rdata.spawnBody = bod;
        rdata.spawnMemory = mem;
    }
    */

    /*
    // Note: this sort of audit won't work for inter-room creeps; hence, bad.
    // Instead, rely on T1 and Death events to track census.
    const buildCensus = function(room:Room) {
        const rdata = room.memory;
        const rname = room.name;
        const creeps = room.find(FIND_MY_CREEPS);
        const cl = creeps.length;
        const census = {} as any;
        for (let i=0; i<cl; ++i) {
            const creep = creeps[i];
            const cdata = creep.memory;
            if (cdata.wrname==rname || (cdata.wrname===undefined && cdata.hrname==rname)) {
                const role = cdata.role;
                if (census[role]===undefined)
                    census[role] = 1;
                else
                    census[role]++;
            }
        }
        //console.log(' Census='+utils.stringifykeys(census)+' for '+cl);
        rdata.census = census;
    }
    */

    /*
    const spawnsAreBusy = function(room:Room):boolean {
        const spawns = room.find(FIND_MY_SPAWNS);
        if (spawns==null || spawns.length==0)
            return true;
        for (let i=0; i<spawns.length; ++i) {
            const spawn = spawns[i];
            if (spawn.spawning===undefined || spawn.spawning===null)
                return false;
        }
        return true;
    }
    */

    // for now, this is defcon-5-only, and we don't even look at Defcon4, 3, or lower. Just ignore em!
    //
    // NOTE: rooms never schedule a spawnThink. Instead, it's done on events: (x=done)
    //   + previous spawn finished
    //   + creep replace timer
    //   + unex death
    //   + spawn-energy change
    //   + defcon change
    export const thinkSpawn = function(room:Room) {
        // if someone told us to think but all spawns are actively busy, don't think again
        const rdata = room.memory;
        let spawn = Game.spawns.Spawn1;
        //if (spawnsAreBusy(room))
        if (spawn.spawning!=null)
            return;

        // only mark time when we actually think
        //rdata.lastSpawnTick = Game.time;

        if (spawn.store[RESOURCE_ENERGY]<300)
            return;

        // RC1 think: keep spawning up to max
        //let max = rdata.srcTotSlots + 2*rdata.src.length;
        let max = 5*rdata.src.length;
        let cur = rdata.totCreeps;
        if (cur>=max)
            return;

        let body = [MOVE,MOVE,WORK,CARRY,CARRY];
        let mem = {work:1, act:0};
        doSpawn(body, ROLE.BOOT, room, spawn, mem);

        /*
        // do think
        console.log('Room '+room.name+' is thinking:');
        buildCensus(room);
        if (needUpgrader(room)) {
            requestUpgrader(room);
        } else if (needCarry(room)) {
            requestCarry(room);
        } else if (needMiner(room)) {
            requestMiner(room);
        } else {
            console.log(' no spawn today.');
            delete rdata.spawnRole;
            return;
        }
        */

        //console.log(' decided to spawn role='+rdata.spawnRole);
        //rdata.spawnEnergy = body.bodyCost(rdata.spawnBody);
    }

    export const run = function(room:Room):void {
        //loadT1(room);
        //defendBase(room);
        //if (room.memory.numSpawns>0)
        //    baseSpawn(room);
        // if it's been a while, maybe conditions have changed
        //if (room.memory.spawnRole===undefined && (Game.time - room.memory.lastSpawnTick) > 100)
        //    room.memory.thinkNextTick = true;
    }
}
