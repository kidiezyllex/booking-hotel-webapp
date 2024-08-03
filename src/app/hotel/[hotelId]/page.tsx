import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs/server";
import React from "react";

interface HotelPageProps {
  params: { hotelId: string };
}
// interface AddHotelFormProps {
//   hotel: HotelWithRooms | null;
// }

// export type HotelWithRooms = Hotel & {
//   room: Room[];
// };
const Hotel = async ({ params }: HotelPageProps) => {
  console.log("hotelId", params.hotelId);
  const hotel = await getHotelById(params.hotelId);
  //   const { userId } = auth();
  return (
    <div>
      <AddHotelForm hotel={hotel}></AddHotelForm>
    </div>
  );
};

export default Hotel;
