import prismadb from "../../lib/prismadb";

export const getHotels = async (searchParams: {
  title: string;
  provinces: string;
  districts: string;
}) => {
  try {
    const { title, provinces, districts } = searchParams;
    const hotels = await prismadb.hotel.findMany({
      where: {
        title: {
          contains: title,
        },
        provinces: {
          contains: provinces,
        },
        districts: {
          contains: districts,
        },
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
