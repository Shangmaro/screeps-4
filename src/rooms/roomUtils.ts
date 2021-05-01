// 0: plain
// 1: wall
// 2: swamp
const checkEmptyAppend = function(rv:Pos[], terr:RoomTerrain, x:number, y:number) {
    const t = terr.get(x, y);
    if (t!=1) rv.push({x:x, y:y});
}

// Returns an array of positions around a spot that not blocked
export const getAdjacent = function(terr:RoomTerrain, pos:Pos):Pos[] {
    let rv:Pos[] = [];
    checkEmptyAppend(rv, terr, pos.x-1, pos.y-1);
    checkEmptyAppend(rv, terr, pos.x-1, pos.y);
    checkEmptyAppend(rv, terr, pos.x-1, pos.y+1);
    checkEmptyAppend(rv, terr, pos.x+1, pos.y-1);
    checkEmptyAppend(rv, terr, pos.x+1, pos.y);
    checkEmptyAppend(rv, terr, pos.x+1, pos.y+1);
    checkEmptyAppend(rv, terr, pos.x,   pos.y-1);
    checkEmptyAppend(rv, terr, pos.x,   pos.y+1);
    return rv;
};
