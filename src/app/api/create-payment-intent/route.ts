import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prismadb from "../../../../lib/prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { booking, payment_intent_id } = await req.json();

  const bookingData = {
    ...booking,
    userName: user.firstName,
    userEmail: user.emailAddresses,
    userId: user.id,
    currency: "usd",
    paymentIntentId: payment_intent_id,
  };

  let foundBooking;

  if (payment_intent_id) {
    foundBooking = await prismadb.booking.findUnique({
      where: {
        paymentIntentId: payment_intent_id,
        userId: user.id,
      },
    });
  }

  if (foundBooking && payment_intent_id) {
    // Update booking logic here
  } else {
    // Create new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalPrice * 100,
      currency: bookingData.currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    bookingData.paymentItendId = paymentIntent.id;
    await prisma.booking.create({
      data: bookingData,
    });
    return NextResponse.json({ paymentIntent });
  }
  return new NextResponse("Internal Server Error", { status: 500 });
}
