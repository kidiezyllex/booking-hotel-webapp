import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { hotelid: number } }
) {
  try {
    const hotel = await prismadb.hotel.findUnique({
      where: { id: params.hotelid },
      include: {
        rooms: true,
        bookings: true,
      },
    });

    if (!hotel) {
      return new NextResponse("Hotel not found", { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error at /api/hotel/[hotelid] GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { hotelid: number } }
) {
  try {
    const body = await req.json();

    const hotel = await prismadb.hotel.update({
      where: { id: params.hotelid },
      data: { ...body },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error at /api/hotel/[hotelid] PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { hotelid: number } }
) {
  try {
    const hotel = await prismadb.hotel.delete({
      where: { id: params.hotelid },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error at /api/hotel/[hotelid] DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
