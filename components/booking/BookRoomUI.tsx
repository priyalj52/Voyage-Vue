"use client";
import React, { useEffect, useState } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import useBookRoom from "@/hooks/useBookRoom";
import RoomCard from "../room/RoomCard";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);
const BookRoomUI = () => {
  const { bookingRoomData, clientSecret } = useBookRoom();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { theme } = useTheme();
  // console.log("book in usebook", bookingRoomData)
  // console.log("client in usebook", clientSecret)

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme === "dark" ? "night" : "stripe",
      labels: "floating",
    },
  };
  const router = useRouter();
useEffect(()=>{
setPageLoaded(true)
},[])

  const handleSetSuccess = (val: boolean) => {
    setPaymentSuccess(val);
  };
  if (pageLoaded && !paymentSuccess&& (!bookingRoomData && !clientSecret)) return <div className="flex flex-col items-center gap-4">
  <div className="text-red-600">Oops this page cannot be loaded properly</div>
  <div className="flex items-center gap-4">
  <Button variant={"outline"} onClick={() => router.push("/")}>
           Home
          </Button>
          <Button onClick={() => router.push("/my-bookings")}>
            view bookings
          </Button>
  </div>
  
      </div>;
  

  if (paymentSuccess){
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-black text-xl">Thank you for your payment!</div>
        <Button onClick={() => router.push("/my-bookings")}>
          view bookings
        </Button>
      </div>
    );}

    

  if (!bookingRoomData || !clientSecret) return <div>Loading... </div>;
  return (
    <div className="max-w-[700px] mx-auto">
      {clientSecret && bookingRoomData && (
        <div>
          <h3 className="text-2xl font-semibold mb-6">
            {" "}
            Complete payment to reserve this room
          </h3>
          <div>
            <RoomCard room={bookingRoomData.room} />
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm
                clientSecret={clientSecret}
                handleSetSuccess={handleSetSuccess}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRoomUI;
