"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  BedSingle,
  Building,
  MountainSnow,
  Ship,
  Trees,
  Tv,
  Users,
  Warehouse,
  Wifi,
  VolumeX,
  Dumbbell,
  Hand,
  Martini,
  WashingMachine,
  Soup,
  ShoppingBasket,
  ParkingCircle,
  Bike,
  WifiIcon,
  Film,
  Waves,
  Coffee,
} from "lucide-react";

const items = [
  {
    id: "gym",
    icon: <Dumbbell className="h-4 w-4" />,
    text: "Phòng Gym",
  },
  {
    id: "spa",
    icon: <Hand className="h-4 w-4" />,
    text: "Phòng Spa",
  },
  {
    id: "bar",
    icon: <Martini className="h-4 w-4" />,
    text: "Quầy Bar",
  },
  {
    id: "laundry",
    icon: <WashingMachine className="h-4 w-4" />,
    text: "Giặt ủi",
  },
  {
    id: "restaurant",
    icon: <Soup className="h-4 w-4" />,
    text: "Nhà hàng",
  },
  {
    id: "shopping",
    icon: <ShoppingBasket className="h-4 w-4" />,
    text: "Mua sắm",
  },
  {
    id: "freeParking",
    icon: <ParkingCircle className="h-4 w-4" />,
    text: "Đỗ xe miễn phí",
  },
  {
    id: "bikeRental",
    icon: <Bike className="h-4 w-4" />,
    text: "Thuê xe đạp",
  },
  {
    id: "freeWifi",
    icon: <Wifi className="h-4 w-4" />,
    text: "Wifi miễn phí",
  },
  {
    id: "movieNights",
    icon: <Film className="h-4 w-4" />,
    text: "Xem phim",
  },
  {
    id: "swimmingPool",
    icon: <Waves className="h-4 w-4" />,
    text: "Hồ bơi",
  },
  {
    id: "coffeeShop",
    icon: <Coffee className="h-4 w-4" />,
    text: "Tiệm cafe",
  },
] as const;
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
    <Card onClick={handleClick}>
      <CardHeader>
        <CardTitle>{hotel.title}</CardTitle>
        <CardDescription>
          {hotel.description.length > 100
            ? `${hotel.description.substring(0, 100)}...`
            : hotel.description}
        </CardDescription>
        {/* <CardDescription>{response.username}</CardDescription> */}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={hotel.image}
            alt={hotel.title}
            className="object-cover overflow-visible"
          />
        </div>
        <CardDescription>Các tiện ích</CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) =>
            hotel[item.id] ? (
              <div className="flex flex-row gap-2 items-center" key={item.id}>
                {item.icon}
                <p className="text-sm font-semibold">{item.text}</p>
              </div>
            ) : null
          )}
        </div>
      </CardContent>
    </Card>
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
