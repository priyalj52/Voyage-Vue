'use client'
import { Hotel } from '@prisma/client'
import React from 'react'
import { hotelWithRooms } from './AddHotelForm'
import HotelCard from './HotelCard'

const HotelList = ({hotels}:{hotels:hotelWithRooms[]}) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-x-8 gap-y-12 mt-2'>
        {hotels.map((hotel)=>{
            return(
                <div key={hotel.id}>
<HotelCard hotel={hotel}/>
                </div>
            )
        })}
        
      </div>
  )
}

export default HotelList