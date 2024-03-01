import { getBookings } from "@/actions/getBookings";
import getHotelById from "@/actions/getHotelById";
import HotelDetails from "@/components/hotel/HotelDetails";

interface PageProps{
    params:{
        hotelId:string
    }
}

const page = async({params}:PageProps) => {
const hotel=await getHotelById(params.hotelId)
if(!hotel)
return <div>Oops no hotel details found</div>
const bookings=await getBookings(hotel.id)
return ( <div>
       <HotelDetails hotel={hotel} bookings={bookings}  />
    </div> );
}
 
export default page;