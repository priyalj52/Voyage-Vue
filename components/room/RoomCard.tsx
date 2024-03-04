"use client";
import { Booking, Hotel, Room } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
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
  Edit,
  Home,
  IndianRupee,
  Loader2,
  Mountain,
  Plus,
  Ship,
  Speaker,
  Trash,
  TreePine,
  Tv,
  Users,
  UtensilsCrossed,
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { DatePickerWithRange } from "./DateRangePicker";

import { addDays, differenceInCalendarDays, eachDayOfInterval, setDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { Checkbox } from "../ui/checkbox";
import { auth, useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";
interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  // console.log(room)
  const { setClientSecret, setPaymentIntentId, setRoomData, paymentIntentId } = useBookRoom()
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false)
  const path = usePathname(); //tell whicvh page we are at
  console.log(path, "path");
  const router = useRouter();
  const { toast } = useToast();
  const isPathHasDetails = path?.includes("hotel-details");
const isPathBookRoom=path?.includes("/book-room")
  const [date, setDate] = useState<DateRange | undefined>();
  const [days, setdays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(room.roomCost);
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const { userId } = useAuth()
  const handleBookRoom = () => {
    if (!userId) {
      return toast({
        variant: "destructive",
        title: "Not logged in",
      });

    }
    if (!hotel?.userID) {
      return toast({
        variant: "destructive",
        title: "something went wrong,refresh",
      });

    }
    if (date?.to && date?.from) {
      setIsBookingLoading(true)
      //of type global state
      const bookingRoomData = {
        room,
        totalPrice,
        breakfastIncluded: includeBreakfast,
        startDate: date?.from,
        endDate: date?.to
      }
      setRoomData(bookingRoomData)
      console.log("book in usebook roomcard", bookingRoomData)
      fetch("/api/create-payment-intent/", {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          booking: {
            hotelOwnerID: hotel?.userID,
            hotelId: hotel?.id,
            roomId: room?.id,
            startDate: date?.from,
            endDate: date?.to,
            breakfastIncluded: includeBreakfast,
            totalCost: totalPrice
          }, paymentIntentId
        })
      }).then((res) => {
        setIsBookingLoading(false)
        console.log(res,"heyyyy")
        if (res.status === 401)
          return router.push("/login")
        console.log(res,"hey")
        if(res.status!=500)
        return res?.json()


      }).then((data) => {
        const clientSecret = data.paymentIntent.client_secret;
        setClientSecret(clientSecret)
        // console.log("set clie in usebook", data.paymentIntent.client_secret)
        setPaymentIntentId(data.paymentIntent.id)
        router.push("/book-room")
      }).catch((err:any) => {
        setIsLoading(false);
        console.log(err, "err ");
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      }
      )

} else {
      return toast({
        variant: "destructive",
        title: "please add date",
      });
    }


  }

  useEffect(() => {
    if (date && date.to && date.from) {
      const countDays = differenceInCalendarDays(date.to, date.from);
      setdays(countDays);
      if (countDays && room.roomCost) {
        if (includeBreakfast && room.breakfastPrice) {
          setTotalPrice(
            countDays * room.roomCost + countDays * room.breakfastPrice
          );
        } else {
          setTotalPrice(countDays * room.roomCost);
        }
      } else {
        setTotalPrice(room.roomCost);
      }
    }
  }, [date, room.roomCost, includeBreakfast]);


const disableddates=useMemo(()=>{
let dates:Date[]=[]
const roomBookings=bookings.filter((booking)=>booking.roomId===room.id && booking.paymentStatus)
roomBookings.forEach((booking)=>{
  const range=eachDayOfInterval({
    start:new Date(booking.startDate),
    end:new Date(booking.endDate)
  })
  dates=[...dates,...range]
  
})
return dates
},[bookings])

  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };
  const handleRoomDelete = (room: Room) => {
    setIsLoading(true);
    const imageKey = room.img.substring(room.img.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: "success",
              title: "Room deleted",
            });
            setIsLoading(false);
          })

          .catch((err) => {
            setIsLoading(false);
            console.log(err, "err on deleting room");
            toast({
              variant: "destructive",
              title: "Something went wrong",
            });
          });
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err, "err on deleting image");
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> {room.title}</CardTitle>
        <CardDescription>{room.desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative rounded-lg h-[200px] ">
          <Image
            fill
            src={room.img}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4  content-start text-sm">
          <AmenityItem>
            <Bed className="w-4 h-4" /> {room.bedCount} Bed(s)
          </AmenityItem>
          <AmenityItem>
            <Users className="w-4 h-4" /> {room.guestCount}
          </AmenityItem>
          <AmenityItem>
            <Bath className="w-4 h-4" /> {room.bathRoomCount}
          </AmenityItem>
          {/* room.kingbed>0 equals to !!room.kingbed */}
          {!!room.kingBed && (
            <div className="">
              <AmenityItem>
                <BedDouble className="w-4 h-4" /> {room.kingBed} Bed(s)
              </AmenityItem>
            </div>
          )}
          {!!room.QueenBed && (
            <div className="">
              <AmenityItem>
                <BedSingle className="w-4 h-4" /> {room.QueenBed} Bed(s)
              </AmenityItem>
            </div>
          )}
          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="w-4 h-4" /> Room Services
            </AmenityItem>
          )}

          {room.TV && (
            <AmenityItem>
              <Tv className="w-4 h-4" />
              TV
            </AmenityItem>
          )}

          {room.balcony && (
            <AmenityItem>
              <Home className="w-4 h-4" /> Balcony
            </AmenityItem>
          )}

          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="w-4 h-4" /> Free wifi
            </AmenityItem>
          )}

          {room.cityView && (
            <AmenityItem>
              <Castle className="w-4 h-4" /> City View
            </AmenityItem>
          )}

          {room.forestView && (
            <AmenityItem>
              <TreePine className="w-4 h-4" /> Forest view
            </AmenityItem>
          )}

          {room.oceanView && (
            <AmenityItem>
              <Ship className="w-4 h-4" /> Ocean View
            </AmenityItem>
          )}

          {room.mountainView && (
            <AmenityItem>
              <Mountain className="w-4 h-4" /> mOuntain View
            </AmenityItem>
          )}

          {room.airCondition && (
            <AmenityItem>
              <AirVent className="w-4 h-4" />
              Air Conditioned
            </AmenityItem>
          )}

          {room.soundProofed && (
            <AmenityItem>
              <Speaker className="w-4 h-4" /> Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between">
          <div>
            Room Price <span>&#8377;</span>
            <span className="font-bold">
              {room.roomCost} <span className="text-xs">/24 hrs</span>{" "}
            </span>
          </div>
          {!!room.breakfastPrice && (
            <div>
              Breakfast Price <span>&#8377;</span>
              <span className="font-bold">{room.breakfastPrice} </span>
            </div>
          )}
        </div>

        <Separator />
      </CardContent>
      {!isPathBookRoom  && <CardFooter>
        {isPathHasDetails ? (
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2">
                select the time period you will be staying for.
              </div>
              <DatePickerWithRange date={date} setDate={setDate} disabledDates={disableddates} />
            </div>
            {room.breakfastPrice > 0 && (
              <div>
                <div className="mb-2">Do you want breakfast for all days?</div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breakfast"
                    onCheckedChange={(val) => setIncludeBreakfast(!!val)}
                  />
                  <label htmlFor="breakfast" className="text-sm">
                    Include breakfast?
                  </label>
                </div>
              </div>
            )}

            <div>
              Total Price :{" "}
              <span className="font-bold">&#8377; {totalPrice}</span> for
              <span className="font-bold">{days}days </span>
            </div>
            <Button disabled={isBookingLoading} type="button" onClick={() => { handleBookRoom() }}>
              {isBookingLoading ? <Loader2 className="mr-2 w-4 h-4" /> : <Wand2 className="mr-2 w-4 h-4" />}
              {isLoading ? "Loading.." : "Book Room"}
            </Button>
          </div>
        ) : (
          <div className="flex w-full justify-between">
            <Button
              onClick={() => handleRoomDelete(room)}
              disabled={isLoading}
              type="button"
              variant={"ghost"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4" />
                  Deleting
                </>
              ) : (
                <>
                  <Trash className="mr-2 w-4 h-4" />
                  Delete
                </>
              )}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button
                  variant={"outline"}
                  type="button"
                  className="max-w-[150px]"
                >
                  <Edit className="mr-2 w-4 h-4" />
                  Update Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90%]">
                <DialogHeader className="px-2">
                  <DialogTitle>Update a room</DialogTitle>
                  <DialogDescription>
                    Update details about room
                  </DialogDescription>
                </DialogHeader>
                <AddRoomForm
                  hotel={hotel}
                  room={room}
                  handleDialogOpen={handleDialogOpen}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>}
      
    </Card>
  );
};

export default RoomCard;
