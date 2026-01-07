const log=require("../utils/logger");
const db=require("../config/db");

module.exports=(req,res,next)=>{
    const start=Date.now();

    res.on("finish",()=>{
        const duration=Date.now()-start;

        log(db,"INFO","API Request",{
            reqId:req.reqId,
            method:req.method,
            url:req.originalUrl,
            statusCode:res.statusCode,
            duration:`${duration}ms`,
            userId:req.user?.id||null
        });
    });

    next();
};
