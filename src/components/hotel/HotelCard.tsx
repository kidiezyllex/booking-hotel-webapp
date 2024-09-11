"use client";
import { usePathname, useRouter } from "next/navigation";
import { HotelWithRooms } from "./AddHotelForm";
import React from "react";
import { useAuth } from "@clerk/nextjs";

interface HotelCardProps {
  hotel: {
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
  };
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const router = useRouter();
  const { userId } = useAuth();
  const handleClick = () => {
    router.push(`/${userId}/hotel/${hotel.id}`);
  };

  return (
    <div
      className="border rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={handleClick}
    >
      <img
        src={hotel.image}
        alt={hotel.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{hotel.title}</h3>
        <p className="text-sm text-gray-600">
          {hotel.city}, {hotel.state}, {hotel.country}
        </p>
        <p className="mt-2 text-gray-800">
          {hotel.description.substring(0, 100)}...
        </p>
        <div className="mt-4">
          <p className="text-sm">
            <strong>Free Parking:</strong> {hotel.freeParking ? "Yes" : "No"}
          </p>
          <p className="text-sm">
            <strong>Free Wifi:</strong> {hotel.freeWifi ? "Yes" : "No"}
          </p>
          <p className="text-sm">
            <strong>Bike Rental:</strong> {hotel.bikeRental ? "Yes" : "No"}
          </p>
          <p className="text-sm">
            <strong>Movie Nights:</strong> {hotel.movieNights ? "Yes" : "No"}
          </p>
          <p className="text-sm">
            <strong>Coffee Shop:</strong> {hotel.coffeeShop ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;

// const HotelCard = ({ hotel }: { hotel: HotelWithRooms }) => {
//   const pathname = usePathname();
//   const isMyHotels = pathname.includes("my-hotels");
//   const router = useRouter();

//   return (
//     <div
//       onClick={() => isMyHotels && router.push(`/hotel-details/${hotel.id}`)}
//     >
//       gggg
//     </div>
//   );
// };

// export default HotelCard;
