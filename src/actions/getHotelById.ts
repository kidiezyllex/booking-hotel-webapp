// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
import prismadb from "../../lib/prismadb";

export const getHotelById = async (hotelId: string) => {
  try {
    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelId,
      },
      include: {
        rooms: true,
        bookings: true,
      },
    });

    if (!hotel) {
      //   throw new Error(`Hotel with ID ${hotelId} not found.`);
      return null;
    }

    return hotel;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
