import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import React from "react";

interface HotelPageProps {
  params: { hotelId: number };
}

const Hotel = async ({ params }: HotelPageProps) => {
  console.log("hotelId:", Number(params.hotelId));
  let nhotel = await getHotelById(Number(params.hotelId));
  console.log(nhotel);
  return (
    <div>
      <AddHotelForm hotel={nhotel}></AddHotelForm>
    </div>
  );
};

export default Hotel;
