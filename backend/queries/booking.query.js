module.exports = {
    createBooking: `insert into booking(userId,busId,travelDate,seatNumber,bookingStatus) values(?,?,?,?,'CONFIRMED')`,

    getAllBookings: `SELECT
     b.bookingId,
     b.travelDate,
     b.seatNumber,
     b.bookingStatus,
     u.userId,
     u.username,
     bs.busId,
     bs.busNumber,
     bs.busType,
     r.routeId,
     sd.districtname as sourceDistrict,
    dd.districtName as destinationDistrict,
    b.createdAt
    from booking b 
    join user u on b.userId=u.userId
    join bus bs on b.busId=bs.busId
    join route r on bs.routeId=r.routeId
    join district sd on r.sourceDistrictId=sd.districtId
    join district dd on r.destinationDistrictId=dd.districtId
    where b.deletedAt is null
    order by b.createdAt DESC`,


    getBookingsByUser: `
    select
    b.bookingId,
    b.travelDate,
    b.seatNumber,
    b.bookingStatus,
    bs.busNumber,
    sd.districtName as sourceDistrict,
    dd.districtName as destinationDistrict,
    b.createdAt
    from booking b
    join bus bs on b.busId=bs.busId
    join route r on bs.routeId=r.routeId
    join district sd on r.sourceDistrictId=sd.districtId
    join district dd on r.destinationDistrictId=dd.districtId
    where b.userId=?
    and b.deletedAt is null
    order by b.createdAt desc
    `,

    getBookingById: `select
    b.bookingId,
    b.travelDate,
    b.bookingStatus,
    u.userId,
    u.username,
    bs.busId,
    bs.busNumber,
    bs.busType
    from booking b
    join user u on b.userId=u.userId
    join bus bs on b.busId=bs.busId
    where b.bookingId=?
    and b.deletedAt is null
    `,

    updateBookingStatus: `
    update booking set bookingStatus=? where bookingId=? and deletedAt is null`,

    deleteBooking: `update booking set bookingStatus=? where bookingId=? and deletedAt is null`,

    getBookedCount:`select count(*) as bookedCount from booking
    where busId=? and travelDate=? and bookingStatus='CONFIRMED' and deletedAt is null`,

    getBookedSeats: `
  select seatNumber from booking
  where busId=? and travelDate=? and bookingStatus='CONFIRMED' and deletedAt is null
`

};