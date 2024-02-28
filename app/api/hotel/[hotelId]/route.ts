import prismaDB from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{params:{hotelId:string}}){
    try{
        const body=await req.json()
        const {userId}=auth()
        
        if(!params.hotelId ) 
        return  new NextResponse("Hotel id is req",{status:400})
        if(!userId)
        return  new NextResponse("Unauthorised",{status:401})
  const hotel=await prismaDB.hotel.update({
    where:{
        id:params.hotelId
    },
    data:{
        ...body,
        userID:userId,
    }
  })
  return NextResponse.json(hotel,{status:200})
    }catch(err){
        console.log("Error at api/hotel/hotelId patch route",err)
        return NextResponse.json("Internal Server error",{status:500})
    }
}



export async function DELETE(req:Request,{params}:{params:{hotelId:string}}){
    try{
       
        const {userId}=auth()
        
        if(!params.hotelId ) 
        return  new NextResponse("Hotel id is req",{status:400})
        if(!userId)
        return  new NextResponse("Unauthorised",{status:401})
  const hotel=await prismaDB.hotel.delete({
    where:{
        id:params.hotelId
    },
    
  })
  return NextResponse.json(hotel,{status:200})
    }catch(err){
        console.log("Error at api/hotel/hotelId delete route",err)
        return NextResponse.json("Internal Server error",{status:500})
    }
}