"use client";
import { Booking, Hotel, Room } from "@prisma/client";
import React, {  useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import AmenityItem from "../ui/amenity";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  BedSingle,
  Castle,
 
  Home,
 
  
  MapPin,
  Mountain,

  Ship,

  TreePine,
  Tv,
  Users,
  UtensilsCrossed,

  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import {  useRouter } from "next/navigation";
import { Button } from "../ui/button";

import { useToast } from "../ui/use-toast";

import {
 
  differenceInCalendarDays,
  
} from "date-fns";

import {  useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";
import useLocation from "@/hooks/useLocation";
import moment from "moment";
interface MyBookingUIProps {
  booking: Booking & { Room: Room | null } & { Hotel: Hotel | null };
}

const MyBookingUI: React.FC<MyBookingUIProps> = ({ booking }) => {
  // console.log(room)
  const { setClientSecret, setPaymentIntentId, setRoomData, paymentIntentId } =
    useBookRoom();
  const [isLoading, setIsLoading] = useState(false);
  const { Hotel, Room } = booking;
  const router = useRouter();
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(Hotel?.country);
  const state = getStateByCode(Hotel?.country, Hotel?.state);
  const { userId } = useAuth();
  const startDate = moment(new Date(booking.startDate)).format("DD-YYYY-MM");
  const endDate = moment(new Date(booking.endDate)).format("DD-YYYY-MM");
  const dayCount = differenceInCalendarDays(booking.endDate, booking.startDate);
  const { toast } = useToast();
  if (!Hotel || !Room) {
    return <div>Missing data</div>;
  }

  const handleBookRoom = () => {
    if (!userId) {
      return toast({
        variant: "destructive",
        title: "Not logged in",
      });
    }
    if (!Hotel?.userID) {
      return toast({
        variant: "destructive",
        title: "something went wrong,refresh",
      });
    }

    setIsBookingLoading(true);
    //of type global state
    const bookingRoomData = {
      room: Room,
      totalPrice: booking.totalCost,
      breakfastIncluded: booking.breakfastIncluded,
      startDate: booking.startDate,
      endDate: booking.endDate,
    };
    setRoomData(bookingRoomData);
    console.log("book in usebook MyBookingUI", bookingRoomData);
    fetch("/api/create-payment-intent/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          hotelOwnerID: Hotel?.userID,
          hotelId: Hotel?.id,
          roomId: Room?.id,
          startDate: bookingRoomData.startDate,
          endDate: bookingRoomData.endDate,
          breakfastIncluded: bookingRoomData.breakfastIncluded,
          totalCost: bookingRoomData.totalPrice,
        },
        paymentIntentId,
      }),
    })
      .then((res) => {
        setIsBookingLoading(false);
        console.log(res, "heyyyy");
        if (res.status === 401) return router.push("/login");
        console.log(res, "hey");
        if (res.status != 500) return res?.json();
      })
      .then((data) => {
        const clientSecret = data.paymentIntent.client_secret;
        setClientSecret(clientSecret);
        // console.log("set clie in usebook", data.paymentIntent.client_secret)
        setPaymentIntentId(data.paymentIntent.id);
        router.push("/book-room");
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err, "err ");
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      });
  };

  return (
    <Card>
       
      <CardHeader>
      <CardTitle>{Hotel.title}</CardTitle>
      <CardDescription>
        <div className="font-semibold mt-4">
        <AmenityItem>
                        <MapPin className="w-4 h-4 font-semibold" />
                        {Hotel.city},{state?.name},{country?.name}
                    </AmenityItem>
                    <p className="py-2">{Hotel.locationDesc}</p>
        </div>
      </CardDescription>
        <CardTitle> {Room.title}</CardTitle>
        <CardDescription>{Room.desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative rounded-lg h-[200px] ">
          <Image
            fill
            src={Room.img}
            alt={Room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4  content-start text-sm">
          <AmenityItem>
            <Bed className="w-4 h-4" /> {Room.bedCount} Bed(s)
          </AmenityItem>
          <AmenityItem>
            <Users className="w-4 h-4" /> {Room.guestCount}
          </AmenityItem>
          <AmenityItem>
            <Bath className="w-4 h-4" /> {Room.bathRoomCount}
          </AmenityItem>
          {/* Room.kingbed>0 equals to !!Room.kingbed */}
          {!!Room.kingBed && (
            <div className="">
              <AmenityItem>
                <BedDouble className="w-4 h-4" /> {Room.kingBed} Bed(s)
              </AmenityItem>
            </div>
          )}
          {!!Room.QueenBed && (
            <div className="">
              <AmenityItem>
                <BedSingle className="w-4 h-4" /> {Room.QueenBed} Bed(s)
              </AmenityItem>
            </div>
          )}
          {Room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="w-4 h-4" /> Room Services
            </AmenityItem>
          )}

          {Room.TV && (
            <AmenityItem>
              <Tv className="w-4 h-4" />
              TV
            </AmenityItem>
          )}

          {Room.balcony && (
            <AmenityItem>
              <Home className="w-4 h-4" /> Balcony
            </AmenityItem>
          )}

          {Room.freeWifi && (
            <AmenityItem>
              <Wifi className="w-4 h-4" /> Free wifi
            </AmenityItem>
          )}

          {Room.cityView && (
            <AmenityItem>
              <Castle className="w-4 h-4" /> City View
            </AmenityItem>
          )}

          {Room.forestView && (
            <AmenityItem>
              <TreePine className="w-4 h-4" /> Forest view
            </AmenityItem>
          )}

          {Room.oceanView && (
            <AmenityItem>
              <Ship className="w-4 h-4" /> Ocean View
            </AmenityItem>
          )}

          {Room.mountainView && (
            <AmenityItem>
              <Mountain className="w-4 h-4" /> mOuntain View
            </AmenityItem>
          )}

          {Room.airCondition && (
            <AmenityItem>
              <AirVent className="w-4 h-4" />
              Air Conditioned
            </AmenityItem>
          )}

          {Room.soundProofed && (
            <AmenityItem>
              <AudioListener className="w-4 h-4" /> Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between">
          <div>
            Room Price <span>&#8377;</span>
            <span className="font-bold">
              {Room.RoomCost} <span className="text-xs">/24 hrs</span>{" "}
            </span>
          </div>
          {!!Room.breakfastPrice && (
            <div>
              Breakfast Price <span>&#8377;</span>
              <span className="font-bold">{Room.breakfastPrice} </span>
            </div>
          )}
        </div>

        <Separator />
        <div className="flex flex-col gap-2">
          <CardTitle>Booking details</CardTitle>
          <div className="text-primary/90">
            <div>
              Room Booked by {booking.userName} for {dayCount} days at{" "}
              {moment(booking.bookedAt).fromNow()}
            </div>
            <div>Checked In -{startDate} at 2 pm</div>
            <div>Checked Out -{endDate} at 2 pm</div>
            {booking.breakfastIncluded && (
              <div className="text-blue-500">Breakfast will be served</div>
            )}
            {booking.paymentStatus ? (
              <div className="text-green-500">Paid Rs ${booking.totalCost}-Room reserved</div>
            ) : (
              <div className="text-red-500">
                Not paid Rs ${booking.totalCost} ,Room Not Reserved
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button disabled={isBookingLoading} variant={"outline"} onClick={()=>router.push(`/hotel/hotel-details/${Hotel.id}`)}>View Hotel</Button>
        {!booking.paymentStatus  && booking.userID===userId && <Button onClick={()=>handleBookRoom()} disabled={isBookingLoading}>{isBookingLoading?"Processing":"Pay Now"}</Button>}
      </CardFooter>
    </Card>
  );
};

export default MyBookingUI;
