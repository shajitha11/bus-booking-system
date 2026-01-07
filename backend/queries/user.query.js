module.exports = {
    getUserById: "select * from `user` where userId=?",

    checkUserExists: "select * from `user` where (username=? or email=?) and deletedAt is NULL",

    insertUser: "insert into `user`(username,email,password,phone,role)values(?,?,?,?,?)",

    getUserByUsername: "select * from `user` where username=? and deletedAt is NULL",

    getUserByEmail: "select * from `user` where email=? and deletedAt is NULL",

    updatePasswordById: "update `user` set password=? where userId=? and deletedAt is NULL"
}