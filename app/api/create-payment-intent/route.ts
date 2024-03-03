import prismaDB from "@/lib/prismadb";
import { API_VERSION, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ msg: "Unauthorized", status: 401 });
  
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

  if (paymentIntentId) {
    foundBooking = await prismaDB.booking.findUnique({
      where: {
        paymentIntentID: paymentIntentId,
        userID: user.id,
      },
    });
  }

  if (foundBooking && paymentIntentId) {
    const currentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (currentIntent && currentIntent.status === "canceled") {
      // If the current PaymentIntent is canceled, create a new one
      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.totalCost * 100,
        currency: bookingData.currency,
        automatic_payment_methods: { enabled: true },
        description: `Hotel Booking for ${user.firstName}`,
        payment_method: 'pm_card_visa',
        // confirm:true
      });

      // Update bookingData with new PaymentIntent ID
      bookingData.paymentIntentID = paymentIntent.id;

      // Create a new booking with updated data
      const newBooking = await prismaDB.booking.create({
        data: bookingData,
      });

      return NextResponse.json({ 
        msg: "New PaymentIntent created and booking updated", 
        booking: newBooking,
        paymentIntent: paymentIntent,
        status: 200 
      });
    } else {
      // If the current PaymentIntent is not canceled, update it
      const updatedIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: booking.totalCost * 100,
        description: `Booking for ${user.firstName}`
      });

      const res = await prismaDB.booking.update({
        where: {
          paymentIntentID: paymentIntentId,
          userID: user.id
        },
        data: bookingData
      });

      if (!res)
        return NextResponse.error();
      
      return NextResponse.json({ 
        msg: "PaymentIntent updated and booking updated", 
        paymentIntent: updatedIntent, 
        status: 200 
      });
    }
  } else {
    // If no booking or paymentIntentId is provided, create a new PaymentIntent and booking
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalCost * 100,
      currency: bookingData.currency,
      automatic_payment_methods: { enabled: true },
      description: `Hotel Booking for ${user.firstName}`,
      payment_method: 'pm_card_visa',
    
    });

    bookingData.paymentIntentID = paymentIntent.id;
    const newBooking = await prismaDB.booking.create({
      data: bookingData,
    });

    return NextResponse.json({ 
      msg: "New PaymentIntent created and new booking created", 
      booking: newBooking,
      paymentIntent: paymentIntent,
      status: 200 
    });
  }
  
  return NextResponse.json({ msg: "Internal server error", status: 500 });
}



// import prismaDB from "@/lib/prismadb";
// import { API_VERSION, currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// export async function POST(req: Request) {
//   const user = await currentUser();
//   if (!user) return NextResponse.json({ msg: "Unaythorized", status: 401 });
//   const body = await req.json();
//   const { booking, paymentIntentId } = body;
//   const bookingData = {
//     ...booking,
//     userName: user.firstName,
//     userEmail: user.emailAddresses[0].emailAddress,
//     userID: user.id,
//     currency: "inr",
//     paymentIntentID: paymentIntentId,
 
//   };


//   let foundBooking;
//   if (paymentIntentId){
//     foundBooking= await prismaDB.booking.findUnique({
//       where: {
//         paymentIntentID: paymentIntentId,
//         userID: user.id,
//       },
//     });
//   }
//   if (foundBooking && paymentIntentId) {
//     //update as we dont want multiple bookings if  the transaction wasnt success earlier
//     const currentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
//     if (currentIntent) {
//       const updatedIntent = await stripe.paymentIntents.update(
//         paymentIntentId,
//         {
//           amount: booking.totalCost * 100,
//           description: ` Booking for ${user.firstName}`
//         }
       
//       ); console.log("updated inten",updatedIntent)
// //add booking here its not a single as obviously diff rooms 
//       const res = await prismaDB.booking.update(
//         {
//           where: {
//             paymentIntentID: paymentIntentId,
//             userID: user.id
//           },
//           data: bookingData
//         }
//       );

//       if (!res)
//         return NextResponse.error()
//       return NextResponse.json({ paymentIntent: updatedIntent, status: 200 });
//     }

//   } else {
//     //create
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: booking.totalCost * 100,
//       currency: bookingData.currency,
//       automatic_payment_methods: { enabled: true },
//       description: `Hotel Booking for ${user.firstName}`,
//       confirm:true
//     });

//     bookingData.paymentIntentID = paymentIntent.id;
//     await prismaDB.booking.create({
//       data: bookingData,
//     });
//     return NextResponse.json({ paymentIntent, status: 200 });
//   }
//   return NextResponse.json({ msg: "internal server error", status: 500 });
// }
