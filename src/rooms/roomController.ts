// For the controller, picks a desired direction from the Controller for a group of upgraders to sit.

//import { NUtil } from '../core/utils'

const WEST = 1;
const EAST = 2;
const NORTH = 3;
const SOUTH = 6;
const NORTHEAST = 5;
const SOUTHEAST = 8;
const SOUTHWEST = 7;
const NORTHWEST = 4;

/*
// returns an Array(8) of positions, by preference
var calcPrefer = function(cont:StructureController) {
    const dx = Math.abs(cont.pos.x - 25);
    const dy = Math.abs(cont.pos.y - 25);
    const dd = dx - dy;
    const vert = (dd < 0) ? 1 : 0;
    const ivert = 1 - vert;
    const diag = (dx>3 && dd*dd <= 16) ? 1 : 0;
    const ew = (dx > 0) ? 2 : 1;
    const ns = (dy > 0) ? 6 : 3;
    const xew = 3 - ew;
    const xns = 9 - ns;
    const prefer = Array(8);
    // i am not inclined to optimize this any further
    if (diag>0) {
        prefer[0] = xns + xew;
        prefer[1] = vert*xns + ivert*xew;
        prefer[2] = vert*xew + ivert*xns;
        prefer[3] = vert*(xns+ew) + ivert*(ns+xew);
        prefer[4] = vert*(ns+xew) + ivert*(xns+ew);
        prefer[5] = vert*ew + ivert*ns;
        prefer[6] = vert*ns + ivert*ew;
        prefer[7] = ns + ew;
    } else {
        prefer[0] = vert*xns + ivert*xew;
        prefer[1] = xns + xew;
        prefer[2] = vert*(xns+ew) + ivert*(ns+xew);
        prefer[3] = vert*xew + ivert*xns;
        prefer[4] = vert*ew + ivert*ns;
        prefer[5] = vert*(ns+xew) + ivert*(xns+ew);
        prefer[6] = ns + ew;
        prefer[7] = vert*ns + ivert*ew;
    }
    return prefer;
}

const x1a = [0, -3,  2, -1, -3,  1, -1, -3,  3];
const x1d = [0,  0,  0,  0,  0,  1,  0,  0, -1];
const xwa = [0,  2,  2,  3,  3,  3,  3,  1,  1];
const xwd = [0,  0,  0,  0, -1, -1,  0,  1,  1];
const y1a = [0, -1, -1, -3, -3, -3,  1,  2,  1];
const ywa = [0,  3,  3,  2,  3,  3,  2,  3,  3];

var terrOpen = function(terr:RoomTerrain, x:number, y:number) {
    const val = terr.get(x, y);
    if (val==TERRAIN_MASK_WALL) return false;
    return true;
}

// 4 3 5 : add 3 north                  * * *          * *         * * *
// 1 0 2 : add 1 west, add 2 east       * *            * *         * * *
// 7 6 8 : add 6 south                  *              * *
var contOpen = function(terr:RoomTerrain, cpos:RoomPosition, dir:number) {
    let x1 = x1a[dir] + cpos.x;
    let y1 = y1a[dir] + cpos.y;
    let xw = xwa[dir];
    let yw = ywa[dir];
    for (let y=0; y<yw; ++y) {
        const ty = y + y1;
        for (let x=0; x<xw; ++x) {
            if (!terrOpen(terr, x+x1, ty))
                return false;
        }
        xw += xwd[dir];
        x1 += x1d[dir];
    }
    return true;
}

var vp = function(pos:Pos) {
    return '(' + pos.x+','+pos.y+')';
}

global.shup = function() {
    const room = Game.spawns.Spawn1.room;
    const cont = room.controller;
    const cpos = cont!.pos;
    const terr = room.getTerrain();
    const prefer = calcPrefer(cont!);
    console.log("UP: prefer = "+prefer);
    console.log("UP: terrOpen(0,-1) = "+terrOpen(terr, cpos.x, cpos.y-1));
    const opens = Array(8);
    for (let i=0; i<8; ++i) {opens[i] = contOpen(terr, cpos, i+1)};
    console.log("UP: contOpen(1..8) = "+opens);
    const dir = findOpenCont(terr, prefer, cpos);
    console.log("UP: estalished preference = "+dir);
    const up = buildUpdata(cpos, dir);
    const str = "r="+vp(up.road)+' c='+vp(up.cont)+' p0='+vp(up.pt[0])+' p1='+vp(up.pt[1])+' p2='+vp(up.pt[2])+' p3='+vp(up.pt[3]);
    console.log("UP: data="+str);
}
global.shupfix = function() {
    const room = Game.spawns.Spawn1.room;
    const updata = buildUpdata(room.controller!.pos, 4);
    room.memory.updata = updata;
}
global.shupdata = function() {
    const room = Game.spawns.Spawn1.room;
    const up = room.memory.updata!;
    const str = "UP: r="+vp(up.road)+' c='+vp(up.cont)+' p0='+vp(up.pt[0])+' p1='+vp(up.pt[1])+' p2='+vp(up.pt[2])+' p3='+vp(up.pt[3]);
    console.log(str);
    console.log("UP: ups="+NUtil.stringifyarray(up.ups));
}

const HSHAPE = 0;
const VSHAPE = 1;
const CORNER = 2;
var tiers = [
    [
        {s:HSHAPE,x:[-3,-2,-1,1],y:[-3,2]},
        {s:VSHAPE,x:[-3,2],y:[-3,-2,-1,1]}
    ],
    [
        {s:HSHAPE,x:[-3,-2,-1,1],y:[-2,1]},
        {s:VSHAPE,x:[-2,1],y:[-3,-2,-1,1]}
    ]
];

var terrRectOpen = function(terr:RoomTerrain, x1:number, y1:number, w:number, h:number) {
    for (let yy=0; yy<h; ++yy) {
        for (let xx=0; xx<w; ++xx) {
            if (!terrOpen(terr, x1+xx, y1+yy))
                return false;
        }
    }
    return true;
}

// build controller data object for a rectangle
var buildContDataRect = function(cpos:RoomPosition, xs:number, ys:number, w:number, h:number) {
    const dx = (w!=2) ? 0 : (xs<0) ? 1 : -1;
    const dy = (w!=3) ? 0 : (ys<0) ? 1 : -1;
    const px = 0;
    const py = 1;
    const x0 = xs;
    const y0 = ys;

    const updata = {} as UpData;
    const cx = cpos.x;
    const cy = cpos.y;
    updata.road = {x:x0, y:y0};
    updata.cont = {x:x0+dx, y:y0+dy};
    updata.pt = Array(4);
    updata.pt[0] = {x:x0+px, y:y0+py};
    updata.pt[1] = {x:x0-px, y:y0-py};
    updata.pt[2] = {x:x0+px+dx, y:y0+py+dy};
    updata.pt[3] = {x:x0-px+dx, y:y0-py+dy};
    return updata;
}

const removeDeadUps = function(room:Room) {
    const rdata = room.memory;
    const updata = rdata.updata;
    if (updata==null)
        return;
    for (let i=0; i<4; ++i) {
        const uid = updata.ups[i];
        if (uid!==null) {
            const creep = Game.getObjectById(uid);
            if (creep==null) {
                updata.ups[i] = null;
            }
        }
    }
}

const removeBadUpRes = function(room:Room) {
    const rdata = room.memory;
    const spawns = room.find(FIND_MY_SPAWNS);
    if (spawns===null || spawns.length===0) return;
    let nums = 0;
    for (let i=0; i<spawns.length; ++i) {
        const spawn = spawns[i];
        if (spawn.spawning===undefined) continue;
        // we don't have spawnings separated from lives, so for now if anyone is spawning, don't remove a res
        return;
    }
    // ok, now we KNOW no-one is currently spawning, so get rid of those reservations
    const updata = rdata.updata;
    if (updata==null) return;
    for (let jj=0; jj<4; ++jj) {
        const uid = updata.ups[jj];
        if (uid==='1')
            updata.ups[jj] = null;
    }
}

// returns an available slot index, or -1 if not found
const findEmptyUp = function(room:Room) {
    const rdata = room.memory;
    const updata = rdata.updata;
    if (updata==null)
        return -1;
    for (let i=0; i<4; ++i) {
        const uid = updata.ups[i];
        if (uid===null)
            return i;
    }
    return -1;
}

const claimUSlot = function(creep:Creep) {
    const cdata = creep.memory;
    const room = creep.room;
    const rdata = room.memory;
    if (cdata.upslot===undefined) {
        removeDeadUps(room);
        removeBadUpRes(room);
        const slot = findEmptyUp(room);
        if (slot>=0)
            cdata.upslot = slot;
        else
            return;
    }
    const old = rdata.updata!.ups[cdata.upslot];
    if (old!=='1' && old!==null) {
        global.errlog('creep trying to claim slot taken by someone else, old='+old);
        return;
    }
    rdata.updata!.ups[cdata.upslot] = creep.id;
}

// Find a slot for this creep; set its value to 1.
const reserveUSlot = function(creep:Creep) {
    const cdata = creep.memory;
    const rdata = creep.room.memory;

    // container, if there is one
    const cid = rdata.containers.u;
    cdata.targid = cid as string;

    const updata = rdata.updata!;

    // find a slot
    let slot = 4;
    for (let i=0; i<4; ++i) {
        if (updata.ups[i]==undefined || updata.ups[i]===null) {
            slot = i;
            break;
        }
    }
    if (slot<4) {
        cdata.targx = updata.pt[slot].x;
        cdata.targy = updata.pt[slot].y;
        cdata.upslot = slot;
        if (creep.id===undefined) {
            // reserve
            updata.ups[slot] = '1' as Id<Creep>;
        } else {
            // assign
            updata.ups[slot] = creep.id;
        }
    } else {
        global.errlog("upgrader can't find a slot, ups="+NUtil.stringifyarray(updata.ups));
    }
}

const releaseSlot = function(creep:Creep) {
    const rdata = creep.room.memory;
    rdata.updata!.ups[creep.memory.upslot] = null;
}

const findOpenCont = function(terr:RoomTerrain, prefer:number[], cpos:RoomPosition) {
    for (let i=0; i<8; ++i) {
        const d = prefer[i];
        if (contOpen(terr, cpos, d)) {
            return d;
        }
    }
    return -1;
}

export const dbgShowUpdata = function(rdata:RoomMemory) {
    // do nothing if there's no updata
    if (rdata.updata!==undefined) return;

    const room = Game.rooms[rdata.name];
    const cont = room.controller;
    const terr = room.getTerrain();
    console.log("UP: could not build data for "+rdata.name);
    console.log("UP: prefer = "+calcPrefer(cont!));
    console.log("UP: terrOpen(0,-1) = "+terrOpen(terr, cont!.pos.x, cont!.pos.y-1));
    const opens = Array(8);
    for (let i=0; i<8; ++i) {opens[i] = contOpen(terr, cont!.pos, i+1)};
    console.log("UP: contOpen(1..8) = "+opens);
}

let buildUpdata = function(cpos:RoomPosition, dir:number):UpData {
    const cx = cpos.x;
    const cy = cpos.y;
    const dn = Math.floor(dir/3); // 1,0,2
    const de = dir-dn*3; // 1,0,2
    const dy = dn*(2*dn-3); // (1,0,2) -> -1, 0, 1
    const dx = de*(2*de-3);
    const rx = cx + 3*dx;
    const ry = cy + 3*dy;
    const tx = cx + 2*dx;
    const ty = cy + 2*dy;
    const updata = {} as UpData;
    updata.road = {x:rx, y:ry}; // position of road / access point
    updata.cont = {x:tx, y:ty}; // position of container
    updata.pt = Array(4);
    if (dx==0 || dy==0) {
        // cardinal directions, ie NESW
        updata.pt[0] = {x:rx+dy,    y:ry-dx};
        updata.pt[1] = {x:rx-dy,    y:ry+dx};
        updata.pt[2] = {x:rx+dy-dx, y:ry-dx-dy};
        updata.pt[3] = {x:rx-dy-dx, y:ry+dx-dy};
    } else {
        // diagonal
        updata.pt[0] = {x:rx-Math.floor((dx-dy)/2), y:ry-Math.floor((dx+dy)/2)};
        updata.pt[1] = {x:rx-Math.floor((dx+dy)/2), y:ry+Math.floor((dx-dy)/2)};
        updata.pt[2] = {x:rx-dx+dy, y:ry-dx-dy};
        updata.pt[3] = {x:rx-dx-dy, y:ry+dx-dy};
    }
    return updata;
}
*/

// call during initial room init, and when a room is reserved or controlled
export const initControllerData = function(room:Room) {
    const rdata = room.memory;
    /*

    // first, try optimal positions

    // sort list of preferred directions
    const cont = room.controller;
    if (cont===undefined) return; // well, geez, none of that, then.
    if (cont.owner===undefined) {
        console.log("not my controller - no owner");
    } else if (cont.owner.username!=Memory.Username) {
        console.log("not my controller? me="+Memory.Username+", cont.owner="+cont.owner.username);
        return;
    }
    const prefer = calcPrefer(cont);

    // check each in order, stopping if we get a prefer
    const terr = room.getTerrain();
    const cpos = cont.pos;
    const dir = findOpenCont(terr, prefer, cpos);

    // did we find an open spot?
    if (dir >= 0) {
        const updata = buildUpdata(cpos, dir);
        rdata.updata = updata;
        return;
    }

    // gotta try the tiers
    const cx = cpos.x;
    const cy = cpos.y;
    const tlen = tiers.length;
    for (let tn=0; tn<tlen; ++tn) {
        const tier = tiers[tn];
        const ns = tier.length;
        for (let opt=0; opt<ns; opt++) {
            const shape = tier[opt];
            const xset = shape.x;
            const yset = shape.y;
            let w = 3;
            let h = 2;
            if (shape.s == VSHAPE) {
                w = 2;
                h = 3;
            }
            for (let xsn=0; xsn<xset.length; ++xsn) {
                const xs = xset[xsn];
                const x1 = cx + xs;
                for (let ysn=0; ysn<yset.length; ++ysn) {
                    const ys = yset[ysn];
                    const y1 = cx + ys;
                    if (terrRectOpen(terr, x1, y1, w, h)) {
                        // find the outer center of the block
                        let x0 = xs;
                        let y0 = ys+1;
                        if (w==3) {
                            x0 = xs + 1;
                            y0 = ys;
                            if (ys>0)
                                ++y0;
                        } else if (xs>0)
                            ++x0;
                        // build data & done
                        rdata.updata = buildContDataRect(cpos, x0, y0, w, h);
                        return;
                    }
                }
            }
        }
    }

    // At this point, no contiguous block near the controller, so just
    // let the bots do their own thing.
    delete rdata.updata; // ie, make sure it's null!
    dbgShowUpdata(rdata);
    */
}
