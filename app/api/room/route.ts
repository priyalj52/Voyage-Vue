import prismaDB from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try{
        const body=await req.json()
        const {userId}=auth()
        if(!userId)
        return  new NextResponse("Unauthorised",{status:401})
  const room=await prismaDB.room.create({
    data:{
        ...body
       
    }
  })
  return NextResponse.json(room,{status:200})

    }catch(err){
        console.log("Error at api/room post route",err)
        return  NextResponse.json("Internal Server error",{status:500})
    }
}