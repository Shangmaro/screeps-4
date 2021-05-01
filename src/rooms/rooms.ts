//import { NStats } from '../core/stats'

//import { ramparts } from './roomRamparts'
//import { NDefend } from './roomDefend'
//import { initControllerData } from './roomController'
//import { roads } from './roomRoads'
import { NSource } from './roomSources'

import { RBase } from './roomBase'

export namespace NRoom {
    // Returns count of open positions
    export const openAdjacent = function(terr:RoomTerrain, pos:Pos) {
        let count = 8;
        count -= terr.get(pos.x-1, pos.y-1) & 1;
        count -= terr.get(pos.x-1, pos.y+1) & 1;
        count -= terr.get(pos.x-1, pos.y) & 1;
        count -= terr.get(pos.x+1, pos.y-1) & 1;
        count -= terr.get(pos.x+1, pos.y+1) & 1;
        count -= terr.get(pos.x+1, pos.y) & 1;
        count -= terr.get(pos.x, pos.y-1) & 1;
        count -= terr.get(pos.x, pos.y+1) & 1;
        return count;
    }

    // to map 0,1 -> 1, 2->0 :
    //  (2x-1) : -1, 1, 3
    //  (2x-1) : 1, 1, 9
    //  -9     : -8, -8, 0
    //  /8     : but, yuck! : x^2/2 - x/2 - 1
    // I'd do that, if it didn't require another function call ... which wouldn't be bad?
    // or: constant array

    // given ascii code, returns the next in the sequence 0-9A-Za-z
    var acc = function(cc:number):number {
        let n = cc+1;
        if (n==91) n = 97;
        else if (n==123) n = 48;
        else if (n==58) n = 65;
        return n;
    }

    // 0 upper lower bang
    // Z dot colon tick dash, slash bracket brace plus pipe
    const rabbrmap = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstuvwxy!@#$%^&*()Zz.,:;\'"-_\\/[]{}+=|~';

    // The purpose here is to convert N37E20 to cKE; S0W0 becomes 00w
    // Why do I care? Not sure. I think the purpose was to obfuscate what my minions were doing.
    const abbrFor = function(rname:string):string {
        const nschar = rname[0];
        let index = 2;
        while (rname[index]!='E' && rname[index]!='W')
            index++;
        const ewchar = rname[index];
        const nsstr = rname.substr(1,index-1);
        const ewstr = rname.substr(index+1, rname.length-index-1);
        const affix = (nschar=='N')
            ? ((ewchar=='E') ? 'E' : 'W')
            : ((ewchar=='E') ? 'e' : 'w');
        const nsnum = parseInt(nsstr);
        const ewnum = parseInt(ewstr);
        const ns1 = rabbrmap[nsnum];
        const ew1 = rabbrmap[ewnum];
        const abbr = ns1 + ew1 + affix;
        return abbr;
    }

    const roomNameFor = function(abbr:string):string {
        const nsstr = abbr[0];
        const ewstr = abbr[1];
        const news = abbr[2];
        let ns = 0;
        while (rabbrmap[ns]!=nsstr)
            ++ns;
        let ew = 0;
        while (rabbrmap[ew]!=ewstr)
            ++ew;
        const nstr = (news=='E' || news=='W') ? 'N' : 'S';
        const estr = (news=='E' || news=='e') ? 'E' : 'W';
        const name = nstr + ns + estr + ew;
        return name;
    }

    /*
    // A-999; A-Za-z0-9
    // 65..90, 97-122, 48-57
    const nextAbbr = function() {
        const rv = 'A'; //Memory.nextRoomAbbr;
        const l = rv.length;
        let c0 = rv.charCodeAt(l-1);
        c0 = acc(c0);
        if (l===1) {
            if (c0===65)
                ; //Memory.nextRoomAbbr = 'AA';
            else
                ; //Memory.nextRoomAbbr = String.fromCharCode(c0);
        } else if (l===2) {
            let c1 = rv.charCodeAt(l-2);
            if (c0===65) {
                c1 = acc(c1);
                if (c1===65) {
                    Memory.nextRoomAbbr = 'AAA';
                    return rv;
                }
            }
            Memory.nextRoomAbbr = String.fromCharCode(c1, c0);
        } else {
            let c1 = rv.charCodeAt(l-2);
            let c2 = rv.charCodeAt(l-3);
            if (c0===65) {
                c1 = acc(c1);
                if (c1===65)
                    c2 = acc(c2);
            }
            Memory.nextRoomAbbr = String.fromCharCode(c2, c1, c0);
        }
        return rv;
    }
    */

    /*
    not needed... yet, cuz I haven't coded the addition of a second Spawn
    meanwhile, should be identical to initSpawnData
    const updateSpawns = function(room, rdata) {
        const spawns = room.find(FIND_MY_SPAWNS);
        const nums = spawns.length;
        rdata.spawns = Array(nums);
        for (let i=0; i<nums; ++i) {
            const spawn = spawns[i];
            const data = {x:spawn.pos.x, y:spawn.pos.y, id:spawn.id};
            rdata.spawns[i] = data;
        }
    }
    */

   export const initRoom = function(room:Room, rtype:string) {
        const rname = room.name;
        const rdata = {} as RoomMemory;

        rdata.name = rname; // *** NOT *** rname, just name! rdata.name!
        rdata.abbr = abbrFor(rname);
        rdata.isMine = false; // checked by initControllerData
        rdata.rtype = rtype; // base, mining, extract, enemy, neutral
        rdata.defcon = 5;
        rdata.defense = 0; // attack-power of all defending creeps & towers

        rdata.thinkNextTick = true;
        rdata.nextDefTick = Game.time;
        rdata.nextUnderdogTick = Game.time;
        rdata.nextcstat = Game.time;
        rdata.nextustat = Game.time;
        rdata.lastSpawnTick = 0;
        //rdata.energyStats = NStats.initData(); // should only be done in Base rooms, ie that will have Storage or Terminal
        //rdata.carryStats = NStats.initData(true); // floating-point! num carries bored each tick
        //rdata.minerStats = NStats.initData(true); // floating-point! num miners full each tick
        //rdata.upStats = NStats.initData(); // amount of energy pushed per tick

        rdata.spawnEnergy = 9999;
        rdata.spawnRole = 0;
        rdata.spawnBody = [MOVE,CARRY,WORK];
        rdata.spawnMemory = {};
        rdata.spawnNames = ['Spawn1'];

        rdata.numSpawns = room.find(FIND_MY_SPAWNS).length;
        rdata.containers = {}; // container ids, named s1, u, s2, 4, 5; or maybe s3 or s4
        rdata.towers = [];
        rdata.updata = {} as UpData;
        //rdata.storage = undefined;
        rdata.rs = ''; // road bitfield, using 7-bit encoding, 48 lines of 7 bytes = 336
        rdata.tasks = []; // build & repair
        //rdata.esrc = []; // list of energy providers to carrier, builders, fillers
        //rdata.edst = []; // list of destinations for carriers, fillers
        rdata.repairs = [];
        // rdata.nextTask = undefined;
        rdata.src = [];

        rdata.creepNames = {};
        rdata.totCreeps = 0;
        rdata.minerSpawnTime = 12;
        rdata.census = {}; // by role

        rdata.enemies = [];
        rdata.isOverdog = false;
        rdata.isUnderdog = false;
        rdata.myAttack = 0;
        rdata.hattack = 0;
        rdata.enOnSpawn = 0;
        rdata.defconTimer = 0; // time until Defcon de-escalates

        Memory.rooms[rname] = rdata;

        NSource.initSourceData(room);
        //rooms.initSpawnData(room);
        //initControllerData(room);
    }

    const resetRoom = function(rname:string) {
        const room = Game.rooms[rname];
        if (room!=undefined) {
            const rdata = room.memory;
            NSource.initSourceData(room);
            //initControllerData(room);
        }
    }

    /*
    // called by event.death
    export const creepDeath = function(rname:string, cdata:CreepMemory) {
        // ok, so I want to remove it from the census, BUT:
        //  * no reliable way to get the room it was in -- should be wrname!
        //  * census is not well-defined. It's done before spawn think, but not kept correct.
        //  * so either add it in T1 and remove it here, or don't touch it at all.
        const wrname = cdata.wrname;
        if (wrname===undefined)
            return; // not all creeps have a workroom
        let rdata = Memory.rooms[rname];
        if (rdata===undefined) {
            console.log('Creep with a wrname died, but no memory of the wrname ('+wrname+')');
            return;
        }
        const census = rdata.census;
        let count = census[cdata.role];
        if (count===undefined || count===0)
            return; // prolly not yet included in the census?
        census[cdata.role] = count - 1;
    } */

    /*
    const tickFnFor = function(rtype:string):undefined | RTickFn {
        if (rtype==='base') return RBase.run;
        return undefined;
    }

    const spawnFnFor = function(rtype:string):undefined | RTickFn {
        if (rtype==='base') return RBase.baseThinkSpawn;
        return undefined;
    }
    */

    /*
    const thinkSpawn = function(room:Room) {
        //const fn = spawnFnFor(room.memory.rtype);
        //if (fn!==undefined) {
        //  fn(room);
        //}
        RBase.baseThinkSpawn(room);
    }
    */

    export const run = function() {
        for (let rname in Memory.rooms) {
            const room = Game.rooms[rname];
            if (room===undefined)
                continue;
            const rdata = room.memory;

                // these are appropriate for bases, but not for remote mining, right? and I'm not gonna be using this anyway, right?
            // stats
            //NStats.accumulate(rdata.carryStats);
            //NStats.accumulate(rdata.minerStats);
            //NStats.accumulate(rdata.upStats);

            // spawn?
            //if (rdata.thinkNextTick===true) {
//                rdata.thinkNextTick = false;
            RBase.thinkSpawn(room);
  //          }

            // general room think
            //const rtype = rdata.rtype;
            //const fn = tickFnFor(rtype);
            //if (fn===undefined) {
            //    global.errlog('no fn for room type "'+rtype+'"');
            //    return;
            //}
            //fn(room);
            RBase.run(room);
        }
    }
}
