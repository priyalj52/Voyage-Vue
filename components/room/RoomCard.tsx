'use client'
import { Booking } from '@prisma/client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import AmenityItem from '../ui/amenity';
import { AirVent, Bath, Bed, BedDouble, BedSingle, Castle, Home, IndianRupee, Mountain, Ship, TreePine, Tv, Users, UtensilsCrossed, Wifi } from 'lucide-react';
import { Separator } from '../ui/separator';
interface RoomCardProps{
    hotel?:Hotel &{
        rooms:Room[];
    }
    room:Room;
    bookings?:Booking[];
}



const RoomCard = ({hotel,room,bookings=[]}:RoomCardProps) => {
console.log(room)
  return (
    <Card>
        <CardHeader>
            
          <CardTitle> {room.title}</CardTitle> 
            <CardDescription>{room.desc}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
<div className='aspect-square overflow-hidden relative rounded-lg h-[200px] '>
    <Image fill src={room.img} alt={room.title} className='object-cover' />
</div>
<div className='grid grid-cols-2 gap-4  content-start text-sm'>
<AmenityItem>
    <Bed className='w-4 h-4' /> {room.bedCount} Bed(s)
</AmenityItem>
<AmenityItem>
    <Users className='w-4 h-4' /> {room.guestCount} 
</AmenityItem>
<AmenityItem>
    <Bath className='w-4 h-4' /> {room.bathRoomCount} 
</AmenityItem>
{/* room.kingbed>0 equals to !!room.kingbed */}
{!!room.kingBed  && <div className="">
<AmenityItem>
    <BedDouble className='w-4 h-4' /> {room.kingBed} Bed(s)
</AmenityItem>


</div>}
{!!room.QueenBed  && <div className="">
<AmenityItem>
    <BedSingle className='w-4 h-4' /> {room.QueenBed} Bed(s)
</AmenityItem>


</div>}
{room.roomService && <AmenityItem>
    <UtensilsCrossed className='w-4 h-4' /> Room Services
</AmenityItem>}


{room.TV && <AmenityItem>
    <Tv className='w-4 h-4' />TV
</AmenityItem>}


{room.balcony&& <AmenityItem>
    <Home className='w-4 h-4' /> Balcony
</AmenityItem>}


{room.freeWifi && <AmenityItem>
    <Wifi className='w-4 h-4' /> Free wifi
</AmenityItem>}

{room.cityView&& <AmenityItem>
    <Castle className='w-4 h-4' /> City View
</AmenityItem>}

{room.forestView && <AmenityItem>
    <TreePine className='w-4 h-4' /> Forest view
</AmenityItem>}

{room.oceanView && <AmenityItem>
    <Ship className='w-4 h-4' /> Ocean View
</AmenityItem>}

{room.mountainView && <AmenityItem>
    <Mountain className='w-4 h-4' /> mOuntain View
</AmenityItem>}

{room.aircondition && <AmenityItem>
    <AirVent className='w-4 h-4' />Air Conditioned
</AmenityItem>}


{room.soundProofed && <AmenityItem>
    <AudioListener className='w-4 h-4' /> Sound Proofed
</AmenityItem>}

</div>
<Separator/>
<div className="flex gap-4 justify-between">
<div>Room Price  <span>&#8377;</span><span className='font-bold'>{room.roomCost} <span className='text-xs'>/24 hrs</span> </span></div>
{!!room.breakfastPrice && <div>Breakfast  Price  <span>&#8377;</span><span className='font-bold'>{room.breakfastPrice}  </span></div>}
</div>

<Separator/>


            </CardContent>
    </Card>
  )
}

export default RoomCard