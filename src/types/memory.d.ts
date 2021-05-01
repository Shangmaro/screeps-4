interface CreepMemory {
    role: number;
    rname: string;
    hrname: string;
    wrname?: string;
    upgrading?: boolean;
    harvesting?: boolean;
    work: number; // number of work parts
    expectedDeath: number;
    upslot: number
    targid?: string
    targx: number
    targy: number
    act: number
    msrcid?: string
    replaceTicks?: number
    _?: number
}

interface MinerMemory extends CreepMemory {
    busboy?: boolean
    snum?: number
    srcx: number
    srcy: number
    xid?: Id<StructureContainer>
    slot?: number
}

interface RoomMemory {
    // room data
    name: string
    abbr: string
    isMine: boolean
    rtype: string;
    defcon: number
    rc: number;
    defense: number
    // thinking
    thinkNextTick: boolean
    nextDefTick: number
    nextUnderdogTick: number
    nextcstat: number
    nextustat: number
    minet: number
    lastSpawnTick: number
    energyStats: StatsData
    carryStats: StatsData
    minerStats: StatsData
    upStats: StatsData
    // spawning
    spawnEnergy: number
    spawnRole?: number
    spawnBody: BodyPartConstant[]
    spawnMemory: any
    creepNames: {[key:number]: number}
    spawnNames: [name:string];
    // structures
    numSpawns: number;
    containers: ContainerMem
    towers: TowerData[]
    updata?: UpData
    storage?: Id<StructureStorage>
    rs: string
    tasks: []
    repairs: []
    nextTask: any
    src: SourceData[]
    srcTotSlots: number
    // creeps
    totCreeps: number
    minerSpawnTime?: number;
    census: {[key:number]: number}
    // combat
    enemies: []
    isOverdog: boolean
    isUnderdog: boolean
    myAttack: number
    hattack: number
    enOnSpawn: number
    defconTimer: number
}

interface Memory {
    checkZero?: boolean,
    errlogs: {[msg:string]:ErrLog},
    errlogn: number, // total errors
    errlogsn: number, // number of unique error strings
    next: NextData[],
    friends: string[],
    neutrals: string[],
    gameStart: number,
    home: string,
    globalTimer: number
    Username: string,
    t1: {[key:string]:PerTickRoomData}
}

