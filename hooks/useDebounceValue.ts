import { useEffect, useState } from "react";

export function  useDebounceValue<T>(value:T,delay?:number){
    const [debounceValue,setDebounceValue]=useState<T>(value)
    useEffect(()=>{
        const timer=setTimeout(()=> setDebounceValue(value),delay?delay:3000);
        return () => clearTimeout(timer);

    },[value,delay])
    return debounceValue
}