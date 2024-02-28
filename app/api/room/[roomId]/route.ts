import prismaDB from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{params:{roomId:string}}){
    try{
        const body=await req.json()
        const {userId}=auth()
        
        if(!params.roomId ) 
        return  new NextResponse("room id is req",{status:400})
        if(!userId)
        return  new NextResponse("Unauthorised",{status:401})
  const room=await prismaDB.room.update({
    where:{
        id:params.roomId
    },
    data:{
        ...body,
        
    }
  })
  return NextResponse.json(room,{status:200})
    }catch(err){
        console.log("Error at api/room/roomId patch route",err)
        return NextResponse.json("Internal Server error",{status:500})
    }
}



export async function DELETE(req:Request,{params}:{params:{roomId:string}}){
    try{
       
        const {userId}=auth()
        
        if(!params.roomId ) 
        return  new NextResponse("room id is req",{status:400})
        if(!userId)
        return  new NextResponse("Unauthorised",{status:401})
  const room=await prismaDB.room.delete({
    where:{
        id:params.roomId
    },
    
  })
  return NextResponse.json(room,{status:200})
    }catch(err){
        console.log("Error at api/room/roomId delete route",err)
        return  NextResponse.json("Internal Server error",{status:500})
    }
}