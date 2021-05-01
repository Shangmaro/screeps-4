export namespace NUtil {
    // consider a tower to do 200 pts of damage, vs one attack unit's 30, or ranged's 10
    export const towerPower = function(tdata:TowerData) {
        const tower = Game.getObjectById(tdata.id);
        const energy = tower!.store[RESOURCE_ENERGY];
        let shots = Math.floor(energy / 10);
        if (shots > 10) shots = 10;
        return shots * 200;
    }

    export const d2 = function(p1:Pos, p2:Pos) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return dx*dx + dy*dy;
    }

    export const d1 = function(p1:Pos, p2:Pos) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.floor(Math.sqrt(dx*dx + dy*dy));
    }

    export const d2xy = function(p1:Pos, x:number, y:number) {
        const dx = p1.x - x;
        const dy = p1.y - y;
        return dx*dx + dy*dy;
    }

    export const stringifykeys = function(obj:object) {
        const keys = Object.keys(obj);
        let rv = '{';
        for (let i=0; i<keys.length; ++i) {
            if (i>0) rv += ',';
            rv += keys[i];
        }
        rv += '}';
        return rv;
    }

    export const stringifyarray = function(arr:any[]) {
        let rv = '[';
        for (let i=0; i<arr.length; ++i) {
            if (i>0) rv += ',';
            rv += arr[i];
        }
        rv += ']';
        return rv;
    }

    export const countNonZero = function(arr:any[]) {
        let count = 0;
        for (let i=0; i<arr.length; ++i) {
            const v = arr[i];
            if (v!==0 && v!==null && v!==undefined)
                ++count;
        }
        return count;
    }

    export const closest = function(pos:Pos, objects:PosHaver[]) {
        const len = objects.length;
        let target = objects[0];
        let range = target.pos.getRangeTo(pos as RoomPosition);
        for (let i=1; i<len; ++i) {
            const t = objects[i];
            let r = t.pos.getRangeTo(pos as RoomPosition);
            if (r<range) {
                range = r;
                target = t;
            }
        }
        return target;
    }

    export const unenergiest = function(pos:Pos, creeplist:Creep[]) {
        const len = creeplist.length;
        if (len==0) return null;
        let target = creeplist[0];
        let value = 9999;
        if (!(target instanceof Creep)) {
            console.log('unen is not creep, '+JSON.stringify(target));
        } else {
            value = target.store.getUsedCapacity();
        }
        for (let i=1; i<len; ++i) {
            const t = creeplist[i];
            const v = t.store.getUsedCapacity();
            if (v<value) {
                value = v;
                target = t;
            }
        }
        return target;
    }

    // really, do NOT call this expecting an empty list.
    export const findFirstPos = function(room:Room, key:FindConstant):Pos|null {
        const targets = room.find(key);
        if (targets===undefined || targets.length===0) return null;
        return (targets[0] as any).pos;
    }

    export const wrname = function(cdata:CreepMemory) {
        if (cdata.wrname!==undefined) return cdata.wrname;
        return cdata.hrname;
    }

    export type SxFilterFn = (sx:Structure) => boolean;
    export const filterSx = function(hstrux:Structure[], fn:SxFilterFn):Structure[] {
        let rv = [] as Structure[];
        for (let i=0; i<hstrux.length; ++i) {
            const sx = hstrux[i];
            if (fn(sx))
                rv.push(sx);
        }
        return rv;
    }
}
