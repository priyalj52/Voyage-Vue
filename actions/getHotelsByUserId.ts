import prismaDB from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"

const getHotelsByUserId = async () => {
    try {
        const {userId}=auth()
        if(!userId)
        throw new Error('unauthorised')
        const hotels = await prismaDB.hotel.findMany(
            {
                where: {
                    userID: userId
                },
                include: {
                    rooms: true
                }

            }
  
 )
 if (!hotels) return null
 return hotels
    }catch (err: any) {
throw new Error(err)
}

}
export default getHotelsByUserId