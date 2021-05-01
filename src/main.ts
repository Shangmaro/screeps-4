// 'foreach' works only on arrays, and doesn't break continue or return -- array.forEach((s)=>{})
// 'for in' iterates through names of object properties -- for (key in obj) {}
// 'for of' iterates anything iterable, and allows break/continue/return
//
// null==undef, 0!=null, 0!=undef       -- ie, this is JS!

//gFns = {};

import { NInit } from './core/init';

//import './core/errlog';
//import { NUtil } from './core/utils';
//import './core/build';
//import './core/debug';
//import './core/events';
//import './core/friends';
//import { next } from './core/next';
//import { NEmpire } from './rooms/empire';
//import { NStats } from './core/stats';
//import './core/tasks';

import { NCreep } from './creeps/creeps';
//import { NSquad } from './creeps/squads';
import { NRoom } from './rooms/rooms';

import { ErrorMapper } from "utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
//export const loop = function() {
//    console.log(`Current game tick is ${Game.time}`);
    // Do only once
    if (Memory.checkZero === undefined) {
        NInit.checkZero();
        Memory.checkZero = true;
    }

    //init.startTick();
    //next.doNext();

    // Game.time stores the actual game tick, incl ticks that we missed cuz of CPU overage (ie, so don't use Memory.tick)

    //NEmpire.run();
    NRoom.run();
    //NSquad.run();
    NCreep.run();

    //init.endOfTick();
});
