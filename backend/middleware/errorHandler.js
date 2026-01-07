const log=require("../utils/logger");
const db=require("../config/db");

module.exports=(err,req,res,next)=>{
    log(db,"ERROR",err.message,{
        reqId:req.reqId,
        stack:err.stack,
        url:req.originalUrl,
        method:req.method
    });

    res.status(500).json({
        message:"Internal Server Error"
    });
};