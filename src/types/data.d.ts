type RTickFn = (room:Room) => void;
type CTickFn = (creep:Creep) => void;

interface NextData {
    fnName: string,
    param: any
}

interface StatsData {
    v: number[]
    i: number
    ii: number
    iii: number
    tot: number
    avg: number
    real: boolean
    tick: number
}

interface SourceData {
    id: Id<Source>
    slots: Pos[]
    size: number
    miners: (0|Id<Creep>)[]
    work: number
}

interface TowerData {
    id: Id<StructureTower>
    underConstruction?: boolean
    eid: Id<Creep>
}

interface UpData {
    ups: (null|Id<Creep>)[]
    road: Pos
    cont: Pos
    pt: Pos[]
}

interface PosHaver {
    pos: RoomPosition
}

interface IdHaver {
    id: string
}

interface ErrLog {
    msg: string,
    tik: number,
    cnt: number
}

interface Pos {
    x: number,
    y: number
}

interface ContainerMem {
    u?: Id<StructureContainer>
    s1?: string
    s2?: string
    s3?: string
    s4?: string
}

interface PerTickRoomData {
    enemies: Creep[]
    nonenemies: Creep[]
}
