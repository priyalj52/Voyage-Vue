"use client";
import * as z from "zod";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

interface AddHotelFormProps {
  hotel: hotelWithRooms | null;
}
export type hotelWithRooms = Hotel & {
  rooms: Room[];
};

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title musti be 3 char long",
  }),

  desc: z.string().min(10, {
    message: "Title musti be 10 char long",
  }),

  img: z.string().min(1, {
    message: "Image is required",
  }),
  country: z.string().min(1, {
    message: "Country is required",
  }),
  state: z.string().optional(),
  city: z.string().optional(),
  locationDesc: z.string().min(10, {
    message: "Location desc must be 10 char long",
  }),
  gym: z.boolean().optional(),
  spa: z.boolean().optional(),
  bar: z.boolean().optional(),
  laundary: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  shopping: z.boolean().optional(),
  freeParking: z.boolean().optional(),
  bikeRental: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  movieNights: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
  coffeeShop: z.boolean().optional(),
});

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title  :""  ,     
      desc   :""  ,   
      img    :""  , 
      country :""  ,
      state  :""  , 
      city   :"" ,    
      locationDesc  :"",
      gym  :false,        
      spa  :false,        
      bar    :false,      
      laundary   :false,  
      restaurant :false,  
      shopping   :false,  
      freeParking :false, 
      bikeRental :false,  
      freeWifi :false,    
      movieNights  :false
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
   
    console.log(values)
  }
 
 
  return <div>AddHotelForm</div>;
};

export default AddHotelForm;
