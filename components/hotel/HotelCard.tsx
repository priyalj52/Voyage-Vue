"use client";
import React from "react";
import { hotelWithRooms } from "./AddHotelForm";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../ui/amenity";

import useLocation from "@/hooks/useLocation";
import { Button } from "../ui/button";

import { Bike, Coffee, Dumbbell, MapPinIcon, ParkingCircle, ShoppingBag, Waves, Wifi, Wine } from "lucide-react";
import { MdDryCleaning, MdMovie, MdRestaurant } from "react-icons/md";
import { FaSpa } from "react-icons/fa6";

const HotelCard = ({ hotel }: { hotel: hotelWithRooms }) => {
  const pathname = usePathname();
  const isMyHotels = pathname.includes("my-hotels");
  const router = useRouter();
  const {getCountryByCode}=useLocation()
  const country=getCountryByCode(hotel.country)
console.log("hotel from hotel card",hotel)
  return (
    <div
      onClick={() => !isMyHotels && router.push(`/hotel-details/${hotel.id}`)}
      className={cn(
        "cursor-pointer col-span-1  transition hover:scale-100",
        isMyHotels && "cursor-default"
      )}
    >
      <div className="flex gap-4 border bg-background/50 border-primary/10 round-lg">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[200px] rounded-s-lg">
          <Image fill src={hotel.img} alt={hotel.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[200px] gap-1 py-2 p-1 text-sm">
          <h2 className="font-bold text-xl">{hotel.title}</h2>  
          <div className="text-primary/90">{hotel.desc.substring(0,45)}...</div>
          <div className="text-primary/90">
            <AmenityItem>
                <MapPinIcon className="w-4 h-4 " /> {country?.name},{hotel.city}
            </AmenityItem>
            {hotel.gym && (
                            <AmenityItem>
                                <Dumbbell className="w-4 h-4" /> Gym
                            </AmenityItem>
                        )}



{hotel.spa && (
                            <AmenityItem>
                              <FaSpa size={18} /> Spa
                            </AmenityItem>
                        )}

{hotel.swimmingPool && (
                            <AmenityItem>
                                <Waves className="w-4 h-4" /> pool
                            </AmenityItem>
                        )}

{hotel.restaurant&& (
                            <AmenityItem>
                                <MdRestaurant size={18}/> Restaurant
                            </AmenityItem>
                        )}

{hotel.freeParking&& (
                            <AmenityItem>
                                <ParkingCircle className="w-4 h-4"  /> Free Parking
                            </AmenityItem>
                        )}

{hotel.bikeRental&& (
                            <AmenityItem>
                                <Bike className="w-4 h-4" />Bike rental
                            </AmenityItem>
                        )}

{hotel.coffeeShop && (
                            <AmenityItem>
                                <Coffee className="w-4 h-4"  /> Coffee Shop
                            </AmenityItem>
                        )}

{hotel.freeWifi && (
                            <AmenityItem>
                                <Wifi className="w-4 h-4" /> Free wifi
                            </AmenityItem>
                        )}

{hotel.shopping && (
                            <AmenityItem>
                                <ShoppingBag className="w-4 h-4" /> Shopping
                            </AmenityItem>
                        )}


{hotel.movieNights&& (
                            <AmenityItem>
                                <MdMovie size={18}/> Movie Nights
                            </AmenityItem>
                        )}
          </div>
          <div className="flex items-center justify-between">
<div className="flex items-center gap-1">
    {hotel?.rooms[0]?.roomCost && <>
    <div className="flex items-center gap-1">
    <span>&#8377;</span>
    <div className="text-sm font-semibold">{hotel?.rooms[0]?.roomCost}</div>
    <div className="text-sm ">/24hrs</div>
    
    </div>
    </>}
</div>
{isMyHotels && 
<Button  variant={"outline"} onCLick={()=>router.push(`/hotel/${hotel.id}`)}>Edit</Button> }
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
