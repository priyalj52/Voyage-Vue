'use client'
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string"
import { useDebounceValue } from '../hooks/useDebounceValue';
const SearchBox = () => {
  const searchParams=useSearchParams()
  const title=searchParams.get("title")
  const [val,setVal]=useState(title||"")
const router=useRouter()
const pathName=usePathname()

  const handleChange:ChangeEventHandler<HTMLInputElement>=(e)=>{
setVal(e.target.value)
  }
const debounceVal=useDebounceValue<string>(val)

useEffect(()=>{
const query={
title:debounceVal
}
const url=qs.stringifyUrl({
  url:window.location.href,query

},{skipNull:true,skipEmptyString:true})
// console.log(url)
router.push(url)
},[debounceVal,router])

  if(pathName!=='/')
  return null
  return (
    <div className=" relative sm:block hidden">
      <Input
        type="text"
        placeholder="Search..."
        className="pl-10 bg-primary/10"
        onChange={handleChange}
      />
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
    </div>
  );
};

export default SearchBox;
