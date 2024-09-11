import { getHotelById } from "@/actions/getHotelById";
import { getHotels } from "@/actions/getHotels";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import HotelList from "@/components/hotel/HotelList";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import React from "react";

interface HomeProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

const HotelListPage = async ({ searchParams }: HomeProps) => {
  const hotels = await getHotels(searchParams);
  return (
    <div>
      <HotelList hotels={hotels} />
    </div>
  );
};

export default HotelListPage;
