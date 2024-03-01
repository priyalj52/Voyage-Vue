import prismaDB from "@/lib/prismadb"

export const getBookings=async(hotelId:string)=>{
    if (!hotelId) {
        throw new Error("Hotel ID is required");
    }
//we want future bookings only
const yesterday=new Date()
yesterday.setDate(yesterday.getDate()-1)
try{
    const bookings=await prismaDB.booking.findMany({
        where: {
            hotelId,
            endDate: { gte: yesterday}
        },
    
    })
    return bookings;
}catch(err:any){
    console.log(err)
    throw new Error(err)
}



}
