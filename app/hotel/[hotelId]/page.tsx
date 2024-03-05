import getHotelById from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs";
import React from "react";
interface hotelPageProps {
  params: {
    hotelId: string;
  };
}
const page = async ({ params }: hotelPageProps) => {
  console.log(params.hotelId, "hotelid hey");
  const hotel = await getHotelById(params.hotelId);
  console.log(hotel, "hotel hey");


  const { userId } = auth();
  if (hotel && hotel.userID !== userId) return <div>Access Denied</div>;
  if (!userId) return <div>Not Authenticated</div>;

  return (
    <div>
     { <AddHotelForm hotel={hotel} />}
    </div>
  );
};

export default page;
