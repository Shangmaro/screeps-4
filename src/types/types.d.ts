interface Console {
  log(message: String | Object, ...args: any[]): void;
}
declare var console: Console;

declare var gFns: any;

declare namespace NodeJS {
    interface Global {
        log: any;
        globalTimer?: number,
        gNext: any,
        gFn: any,
        errlog: (msg:string)=>void,
        showerrs: (start?:number, num?:number)=>void,
        cleanerrs: ()=>void,
        sp: (rolenum:number)=>void,
        spr: (rolenum:number, rname:string)=>void,
        memset: (field:string, value:any)=>void,
        roomset: (field:string, value:any)=>void,
        rthink: ()=>void,
        help: ()=>void,
        shup: ()=>void,
        shupfix: ()=>void,
        shupdata: ()=>void,
    }
}
