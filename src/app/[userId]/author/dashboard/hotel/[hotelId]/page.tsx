import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import DashboardHotelDetails from "@/components/hotel/DashboardHotelDetails";
import React from "react";

interface HotelPageProps {
  params: { hotelId: number; userId: string };
}

const Hotel = async ({ params }: HotelPageProps) => {
  let nhotel = await getHotelById(Number(params.hotelId));
  return (
    <div>
      <DashboardHotelDetails hotel={nhotel}></DashboardHotelDetails>
    </div>
  );
};

export default Hotel;
