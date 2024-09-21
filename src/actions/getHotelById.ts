import prismadb from "../../lib/prismadb";

export const getHotelById = async (hotelId: number) => {
  try {
    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelId,
      },
      include: {
        rooms: true,
      },
    });

    if (!hotel) {
      return null;
    }

    return hotel;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
