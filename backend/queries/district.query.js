module.exports = {
    createDistrict: "insert into district (districtName) values (?)",

    getAllDistricts: "select * from district where deletedAt is NULL",

    updateDistrict: "update district set districtName=? where districtId=? and deletedAt is NULL",

    deleteDistrict: "update district set deletedAt=NOW() where districtId=? and deletedAt is NULL"
};
