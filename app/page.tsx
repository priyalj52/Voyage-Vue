import { getHotels } from "@/actions/getHotels";
import HotelList from "@/components/hotel/HotelList";
import { Button } from "@/components/ui/button";


interface HomeProps{
  searchParams:{
    title: string,
    country: string,
    state: string,
    city: string
}
}

export default async function Home({searchParams}:HomeProps) {
 console.log("searh ",searchParams?.city)
 const hotels=await getHotels(searchParams) 
  // why is it showing title undefined??
 if(!hotels)
 return <div>No hotels found</div>
  return (
    <div className="">
    <HotelList hotels={hotels} />
    </div>
  );
}
