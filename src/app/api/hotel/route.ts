import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const hotel = await prismadb.hotel.create({
      data: {
        ...body,
        rooms: {
          create: [],
        },
        bookings: {
          create: [],
        },
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error at /api/hotel POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
