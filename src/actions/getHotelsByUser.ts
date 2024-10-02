import prismadb from "../../lib/prismadb";

export const getHotelsByUser = async (userId: string) => {
  try {
    const hotels = await prismadb.hotel.findMany({
      where: {
        userId: userId,
      },
      include: {
        rooms: true,
      },
    });
    return hotels;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
