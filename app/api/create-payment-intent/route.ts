import prismaDB from "@/lib/prismadb";
import { API_VERSION, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ msg: "Unaythorized", status: 401 });
  const body = await req.json();
  const { booking, paymentIntentId } = body;
  const bookingData = {
    ...booking,
    userName: user.firstName,
    userEmail: user.emailAddresses[0].emailAddress,
    userID: user.id,
    currency: "inr",
    paymentIntentID: paymentIntentId,
  };


  let foundBooking;
  if (paymentIntentId){
    foundBooking= await prismaDB.booking.findUnique({
      where: {
        paymentIntentID: paymentIntentId,
        userID: user.id,
      },
    });
  }
  if (foundBooking && paymentIntentId) {
    //update as we dont want multiple bookings if  the transaction wasnt success earlier
    const currentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (currentIntent) {
      const updatedIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        {
          amount: booking.totalCost * 100,
        }
      );
//add booking here its not a single as obviously diff rooms 
      const res = await prismaDB.booking.update(
        {
          where: {
            paymentIntentID: paymentIntentId,
            userID: user.id
          },
          data: bookingData
        }
      );

      if (!res)
        return NextResponse.error()
      return NextResponse.json({ paymentIntent: updatedIntent, status: 200 });
    }

  } else {
    //create
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalCost * 100,
      currency: bookingData.currency,
      automatic_payment_methods: { enabled: true },
    });

    bookingData.paymentIntentID = paymentIntent.id;
    await prismaDB.booking.create({
      data: bookingData,
    });
    return NextResponse.json({ paymentIntent, status: 200 });
  }
  return NextResponse.json({ msg: "internal server error", status: 500 });
}
