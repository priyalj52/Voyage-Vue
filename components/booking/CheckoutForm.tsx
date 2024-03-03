"use client";
import useBookRoom from "@/hooks/useBookRoom";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import moment from "moment";
import axios from "axios";

import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
interface CheckoutFormProps {
  clientSecret: string;
  handleSetSuccess: (val: boolean) => void;
}

const CheckoutForm = ({
  clientSecret,
  handleSetSuccess,
}: CheckoutFormProps) => {
  const { bookingRoomData, resetBookRoom } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!clientSecret || !stripe) return;
    handleSetSuccess(false);
    setIsLoading(false);
  }, []);

  if (!bookingRoomData?.startDate || !bookingRoomData?.endDate)
    return <div>Error missing Dates</div>;
  const startDate = moment(bookingRoomData?.startDate).format(" Do MMM YYYY");
  const endDate = moment(bookingRoomData?.endDate).format(" Do MMM YYYY");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements || !bookingRoomData) return;
    try {
      //date overlaps check
    //   const bookings=await axios.get(`/api/booking/${bookingRoomData.room.id}`)
    // return console.log("bookings in hote",bookings.data)
        stripe.confirmPayment({ elements, redirect: "if_required" })
        .then((res) => {
          console.log("res", res);
        
          if (!res.error) {
            console.log("paymemy intent id", res.paymentIntent.id);
            axios
              .patch(`/api/booking/${res?.paymentIntent.id}`)
              .then((res) => {
                toast({
                  variant: "default",
                  title: "Payment Confirmed,room booked",
                });
                router.refresh();
                resetBookRoom();
                handleSetSuccess(true);
                setIsLoading(false);
              })
              .catch((err) => {
                console.error(err);
                toast({
                  variant: "destructive",
                  title: `Something went wrong!`,
                });
                setIsLoading(false);
              });
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
    alert("hey room booked")
    // router.refresh();
    //             resetBookRoom();
    //             handleSetSuccess(true);
    //             setIsLoading(false);
    // router.push("/")
  
  };


  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)} id="payment-form">
        <h1 className="font-semibold mb-2 text-lg">Billing Address</h1>
        <AddressElement
          options={{
            mode: "billing",
            // allowedCountries: ["US", "IN"]
          }}
        />
        <h1 className="font-semibold mb-2 text-lg">Payment Information</h1>
        <PaymentElement id="payment-options" options={{ layout: "tabs" }} />
        <div className="flex flex-col gap-1">
          <Separator />
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-lg ">Your Booking Summary</h2>
            <div> You will check in on -{startDate} at 2pm</div>
            <div> You will check out on -{endDate} at 2pm</div>
            {bookingRoomData?.breakfastIncluded && (
              <div>You will be served with breakfast each day at 8 am </div>
            )}
          </div>
          <Separator />
          <div className="font-bold text-lg ">
            {bookingRoomData?.breakfastIncluded && (
              <div className="mb-2">
                Breakfast Price: Rs {bookingRoomData.room.breakfastPrice}/day
              </div>
            )}
            Total Price: ${bookingRoomData?.totalPrice}
          </div>
        </div>
        {isLoading && (
          <>
            <Alert className="bg-blue-500">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Payment Processing.... </AlertTitle>
              <AlertDescription>
                <div>
                  Pleasse stay on this page as we processed your payment
                </div>
              </AlertDescription>
            </Alert>
          </>
        )}
        <Button disabled={isLoading}>
          {isLoading ? "Processing" : "Pay Now"}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;