import prismaDB from "@/lib/prismadb"

const getHotelById = async (hotelID: string) => {
    try {
        const hotel = await prismaDB.hotel.findUnique(
            {
                where: {
                    id: hotelID
                },
                include: {
                    rooms: true
                }

            }
  
 )
 if (!hotel) return null
 return hotel
    }catch (err: any) {
throw new Error(err)
}

}
export default getHotelById