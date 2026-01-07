function log(db,level,msg,meta={}){
    const query=`insert into log(reqId,level,msg,meta)values(?,?,?,?)`;
    const params=[meta.reqId||null,
    level,
    msg,
    JSON.stringify(meta)
];
db.query(query,params,(err)=>{
    if(err)console.error("log error:",err);
});
};

module.exports=log;