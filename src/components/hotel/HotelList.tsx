"use client";
import React from "react";
import HotelCard from "./HotelCard";

interface HotelListProps {
  hotels: {
    id: number;
    title: string;
    description: string;
    image: string;
    country: string;
    state: string;
    city: string;
    freeParking: boolean;
    freeWifi: boolean;
    bikeRental: boolean;
    movieNights: boolean;
    coffeeShop: boolean;
  }[];
}

const HotelList: React.FC<HotelListProps> = ({ hotels }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelList;
