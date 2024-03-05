"use client";
import React from "react";
import { hotelWithRooms } from "./AddHotelForm";
import { Booking, Room } from '@prisma/client';
import useLocation from "@/hooks/useLocation";
import Image from "next/image";
import AmenityItem from "../ui/amenity";
import { Bike, Coffee, Dumbbell, MapPin, ParkingCircle, ShoppingBag, Waves, Wifi, Wine } from "lucide-react";
import { MdDryCleaning, MdMovie, MdRestaurant } from "react-icons/md";
import { FaSpa } from "react-icons/fa6";
import RoomCard from "../room/RoomCard";
const HotelDetails = ({
    hotel,
    bookings,
}: {
    hotel: hotelWithRooms;
    bookings?: Booking[];
}) => {
    const { getCountryByCode, getStateByCode } = useLocation();
    const country = getCountryByCode(hotel.country);
    const state = getStateByCode(hotel.country, hotel.state);

    return (
        <div className="flex flex-col gap-6 pb-2">
            <div className="aspect-square w-full h-[200px] md:h-[400px] rounded-lg relative overflow-hidden">
                <Image
                    fill
                    src={hotel.img}
                    alt={hotel.title}
                    className="object-cover"
                />
            </div>
            <div>
                <h3 className="font-semibold text-xl md:text-3xl">{hotel?.title}</h3>
                <div className="flex">
                    <AmenityItem>
                        <MapPin className="w-4 h-4 font-semibold" />
                        {state?.name},{country?.name}
                    </AmenityItem>
                </div>
                <div>
                    <h3 className="font-semibold text-lg  mt-4 mb-2">
                        Location Details:
                    </h3>
                    <p className="text-primary/90 mb-2">{hotel?.locationDesc}</p>
                    <h3 className="font-semibold text-lg  mt-4 mb-2">About the Hotel:</h3>
                    <p className="text-primary/90 mb-2">{hotel?.desc}</p>
                    <h3 className="font-semibold text-lg  mt-4 mb-2">
                        Amenities Available:
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 content-start gap-4">
                        {hotel.swimmingPool && (
                            <AmenityItem>
                                <Waves className="w-4 h-4" /> pool
                            </AmenityItem>
                        )}

{hotel.gym && (
                            <AmenityItem>
                                <Dumbbell className="w-4 h-4" /> Gym
                            </AmenityItem>
                        )}

{hotel.bar && (
                            <AmenityItem>
                                <Wine className="w-4 h-4" /> Bar
                            </AmenityItem>
                        )}

{hotel.laundary && (
                            <AmenityItem>
                                <MdDryCleaning size={18} /> Laundary
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
                    <div>
                        {!!hotel.rooms.length && <div>
                            <h3 className="text-lg font-semibold my-4">HOtel Rooms</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {hotel.rooms.map((room)=>{
                                    return <RoomCard room={room} key={room.id} hotel={hotel} bookings={bookings} />
                                })}
                            </div>
                        </div> }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
