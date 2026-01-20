module.exports = {
    createBus: `insert into bus(busNumber,busType,seat_rows,seat_columns,totalSeats,routeId)values(?,?,?,?,?,?)`,

    getAllBuses: `select 
    b.busId,b.busNumber,b.busType,b.seat_rows,b.seat_columns,b.totalSeats,r.routeId,
    sd.districtName as sourceDistrict,
    dd.districtName as destinationDistrict,
    b.createdAt
    from bus b join route r on b.routeId=r.routeId
    join district sd on r.sourceDistrictId=sd.districtId
    join district dd on r.destinationDistrictId=dd.districtId
    where b.deletedAt is null
    order by b.createdAt desc`,

    updateBus: `update bus set busNumber=?,busType=?,seat_rows=?,seat_columns=?,totalSeats=?,routeId=? where busId=? and deletedAt is null`,

    deleteBus: `update bus set deletedAt=CURRENT_TIMESTAMP where busId=? and deletedAt is null`,

    getSeatLayout: `select seat_rows,seat_columns,totalSeats from bus
    where busId=? and deletedAt is null`,
};