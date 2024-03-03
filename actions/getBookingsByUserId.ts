import prismaDB from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"

export const getBookingsByUserId=async()=>{
    try{
const {userId}=auth()
if(!userId)
throw new Error('unauthorised')
const bookings=await prismaDB.booking.findMany({
    where:{
       userID:userId,
    },
    include:{
        Room:true,
        Hotel:true
    },
    orderBy:{
       bookedAt:'desc' 
    }
})
if(!bookings) return null
return bookings
    }catch(err:any){
console.log(err)
throw new Error(err)
    }
}