import { NRole } from '../creeps/roles'
import { createIncrementalCompilerHost } from 'typescript';

export const doSpawn = function(body:BodyPartConstant[], role:number, room:Room, spawn:StructureSpawn, memory:any) {
    const name = nextName(room.memory, role);
    memory.role = role;
    memory.hrname = room.name;
    memory.rname = room.name; // this should be changed whenever a creep changes rooms!
    const rv = spawn.spawnCreep(body, name, {memory:memory});
    if (rv===0) {
        incName(room.memory, role)
    }
    return rv
}

const nextName = function(rdata:RoomMemory, role:number) {
    let num = rdata.creepNames[role] || 1;
    const pre = rdata.abbr;
    let num0 = '';
    if (num<100) {
        if (num<10)
            num0 = '00';
        else
            num0 = '0';
    }
    const rchar = NRole.charFor[role];
    const name = pre + rchar + num0 + num;
    return name;
}

const incName = function(rdata:RoomMemory, role:number) {
    let num = rdata.creepNames[role];
    if (num===undefined) {
        rdata.creepNames[role] = 2;
        return;
    }
    num = num + 1;
    if (num>999) num = 0;
    rdata.creepNames[role] = num;
}
