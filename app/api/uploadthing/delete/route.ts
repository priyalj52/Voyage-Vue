import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
const utapi=new  UTApi();
export async function POST(req:Request){
    const {userId}=auth()
    if(!userId)
    return  NextResponse.json("unauthorised",{status:401});
const {imageKey}=await req.json();
console.log(imageKey);
try{
const res=await utapi.deleteFiles(imageKey);
return NextResponse.json({res,status:200});
}catch(err){
console.log("error",err);
return NextResponse.json({msg:"internal server error",status:500});
}
}