import * as ROLE from '../types/roles'

import { doBoot } from './roleBoot'
import { doCarry, doRoadie, doFiller, doClaim, doMiner, doUpgrade, doBuild, doRepair } from './roleUnimpl'
import { doTank, doAssault, doRanger, doHeal, doDistract, doGuard, doRGuard, doSquad, doDismantle, doOperate } from './roleUnimpl'

export namespace NRole {
    export const eventFnFor = function(role:number, event:string) : CTickFn|null {
        if (role<0 || role>=ROLE.NUM_ROLES) return null;
        const funcName = nameFor(role) + event;
        const fn = gFns[funcName];
        if (fn===undefined) return null;
        return fn;
    }

    export const tickFnFor = function(role:number) : CTickFn|null {
        if (role<0 || role>=ROLE.NUM_ROLES) return null;
        const tickFn = tickFns[role];
        return tickFn;
    }

    const tickFns = Array(ROLE.NUM_ROLES);
    tickFns[ROLE.BOOT]     = doBoot;
    tickFns[ROLE.CARRY]    = doCarry;
    tickFns[ROLE.ROADIE]   = doRoadie;
    tickFns[ROLE.FILLER]   = doFiller;
    tickFns[ROLE.MINER]    = doMiner;
    tickFns[ROLE.UPGRADE]  = doUpgrade;
    tickFns[ROLE.BUILD]    = doBuild;
    tickFns[ROLE.REPAIR]   = doRepair;
    tickFns[ROLE.CLAIM]    = doClaim;
    tickFns[ROLE.ASSAULT]  = doAssault;
    tickFns[ROLE.TANK]     = doTank;
    tickFns[ROLE.RANGER]   = doRanger; // aka Wizard
    tickFns[ROLE.HEAL]     = doHeal;
    tickFns[ROLE.DISTRACT] = doDistract;
    tickFns[ROLE.GUARD]    = doGuard;
    tickFns[ROLE.RGUARD]   = doRGuard;
    tickFns[ROLE.DISMANTLE]= doDismantle;
    tickFns[ROLE.SQUAD]    = doSquad;
    tickFns[ROLE.OPERATE]  = doOperate;

    export const charFor = ROLE.charFor;

    export const nameFor = function(role:number):string {
        if (role<0 || role>=ROLE.NUM_ROLES) return "unknown";
        return ROLE.rnames[role];
    }
}
