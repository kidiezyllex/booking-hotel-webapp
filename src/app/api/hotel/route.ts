import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a new hotel without rooms and bookings
    const hotel = await prismadb.hotel.create({
      data: {
        ...body,
        // You can include default values or omit if not provided
        rooms: {
          create: [], // Optional: omit if not creating new rooms
        },
        bookings: {
          create: [], // Optional: omit if not creating new bookings
        },
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error at /api/hotel POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
