import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const room = await prismadb.room.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error at /api/room POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
