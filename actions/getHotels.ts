import prismaDB from "@/lib/prismadb";

export const getHotels = async (searchparams: {
    title: string,
    country: string,
    state: string,
    city: string
}) => {
    try {
        const { title, country, state, city } = searchparams;
        // console.log(searchparams);
        
     
        const hotels = await prismaDB.hotel.findMany({
            where: {
                title: {
                    contains: title
                },
                country, state, city
            },
            include: { rooms: true }
        });

        return hotels;
    } catch (err:any) {
        console.error(err);
       throw new Error(err) // Return null to indicate failure
    }
};
