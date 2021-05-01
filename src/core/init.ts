import { NRoom } from '../rooms/rooms'

export namespace NInit {
    var startFns: { ():void; } [];

    export const checkZero = function() : void {
        console.log("zeroing mem");

        Memory.errlogs = {};
        Memory.errlogn = 0;
        Memory.errlogsn = 0;

        Memory.next = [];
        Memory.friends = [];
        Memory.neutrals = [];
        Memory.rooms = {};

        Memory.globalTimer = Game.time;
        Memory.gameStart = Game.time;
        const homeRoom:Room = Game.spawns.Spawn1.room;
        const hname = homeRoom.name;
        Memory.home = hname;

        Memory.Username = homeRoom!.controller!.owner!.username;

        NRoom.initRoom(homeRoom, 'base');
    }

    // these are things that are done at the start of EVERY TICK -- ie, they are INIT
    /*
    export const startTick = function() : void {
        // just to make sure, in case the previous tick didn't finish completely
        Memory.t1 = {};

        for (let i=0; i<startFns.length; ++i) {
            startFns[i]();
        }

        // track how long Global has stuck around
        if (global.globalTimer===undefined) {
            global.globalTimer = Game.time;
            const delta = global.globalTimer - Memory.globalTimer;
            console.log("Global stuck around for "+delta+" ticks");
            Memory.globalTimer = Game.time;
        }
    }

    export const endOfTick = function() : void {
        Memory.t1 = {};
    }
    */
}
