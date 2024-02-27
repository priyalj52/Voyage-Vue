import prismaDB from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try{
        const body=await req.json()
        const {userId}=auth()
        if(!userId)
        return  new NextResponse("Unauthorised",{status:401})
  const hotel=await prismaDB.hotel.create({
    data:{
        ...body,
        userID:userId,
    }
  })
  return NextResponse.json(hotel,{status:200})

    }catch(err){
        console.log("Error at api/hotel post route",err)
        return new NextResponse.json("Internal Server error",{status:500})
    }
}