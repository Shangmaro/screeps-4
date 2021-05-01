global.errlog = function(message) {
    if (Memory.errlogsn===undefined) Memory.errlogsn = 0;

    const tick = Game.time;
    const event:ErrLog = Memory.errlogs[message];
    if (event !== undefined) {
        // add count to existing log
        event.cnt++;
    } else if (Memory.errlogsn<100) {
        const log = {
            msg: message,
            tik: tick,
            cnt: 1
        };
        Memory.errlogs[message] = log;
        Memory.errlogsn++;
    }
    ++Memory.errlogn;
    console.log(message);
}

global.showerrs = function(start, num) {
    if (num===undefined) num = 10;
    const keys = Object.keys(Memory.errlogs);
    const alen = keys.length;
    if (start===undefined) start = alen - num;
    if (start<0) start=0;
    if (num>start+alen) num = alen-start;
    console.log('Total Errors: #'+Memory.errlogn+', showing '+num+' (of '+alen+') from '+start);
    for (let i=0; i<num; ++i) {
        const message = keys[start+i];
        const log = Memory.errlogs[message];
        console.log('cnt:'+log.cnt+', 1st:'+log.tik+', msg='+message);
    }
}

global.cleanerrs = function() {
    Memory.errlogs = {};
    Memory.errlogn = 0;
    Memory.errlogsn = 0;
    console.log('Errors reset');
}
