import prismaDB from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{params:{Id:string}}){
    try{
      
        const {userId}=auth()
        console.log("id",params.Id)
        if(!params.Id ) 
        return  new NextResponse("paymentIntent id is req",{status:400})
        if(!userId)
        return  new NextResponse("Unauthorised",{status:401})
  const booking=await prismaDB.booking.update({
    where:{
       paymentIntentID:params.Id
    },
    data:{
     paymentStatus:true
        
    }
  })
  return NextResponse.json(booking,{status:200})
    }catch(err){
        console.log("Error at api/booking/Id patch route",err)
        return NextResponse.json("Internal Server error",{status:500})
    }
}



export async function DELETE(req:Request,{params}:{params:{Id:string}}){
    try{
       
        const {userId}=auth()
        
        if(!params.Id ) 
        return  new NextResponse("Booking id is req",{status:400})
        if(!userId)
        return  new NextResponse("Unauthorised",{status:401})
  const booking=await prismaDB.booking.delete({
    where:{
        id:params.Id
    },
    
  })
  return NextResponse.json(booking,{status:200})
    }catch(err){
        console.log("Error at api/booking/Id delete route",err)
        return  NextResponse.json("Internal Server error",{status:500})
    }
}



export async function GET(req:Request,{params}:{params:{Id:string}}){
  try{
     
      const {userId}=auth()
      
      if(!params.Id ) 
      return  new NextResponse("room id is req",{status:400})
      if(!userId)
      return  new NextResponse("Unauthorised",{status:401})
    const yesterday=new Date()
    yesterday.setDate(yesterday.getDate()-1) //to get booking from today
const bookings=await prismaDB.booking.findMany({
  where:{
      roomId:params.Id,
      paymentStatus:true,
      endDate:{
        gt:yesterday
      }
  },
  
})
return NextResponse.json(bookings,{status:200})
  }catch(err){
      console.log("Error at api/booking/Id GET route",err)
      return  NextResponse.json("Internal Server error",{status:500})
  }
}