import { getBookings } from "@/actions/getBookings";
import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import DashboardHotelDetails from "@/components/hotel/DashboardHotelDetails";
import React from "react";

interface HotelPageProps {
  params: { hotelId: number; userId: string };
}

const HotelDetails = async ({ params }: HotelPageProps) => {
  let nhotel = await getHotelById(Number(params.hotelId));
  let bookings = await getBookings(Number(params.hotelId));
  return (
    <div>
      <DashboardHotelDetails
        hotel={nhotel}
        bookings={bookings}
      ></DashboardHotelDetails>
    </div>
  );
};

export default HotelDetails;
