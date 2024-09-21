"use client";
import React, { useEffect, useState } from "react";
import { Hotel, Room, Booking } from "@prisma/client";
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
  Loader2,
  Wand2,
} from "lucide-react";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const roomAmenities = [
  {
    id: "roomService",
    icon: <Bed className="h-4 w-4" />,
    text: "Dịch vụ phòng",
  },
  {
    id: "tv",
    icon: <Tv className="h-4 w-4" />,
    text: "TV",
  },
  {
    id: "balcony",
    icon: <Warehouse className="h-4 w-4" />,
    text: "Ban công",
  },
  {
    id: "freeWifi",
    icon: <Wifi className="h-4 w-4" />,
    text: "Miễn phí Wifi",
  },
  {
    id: "cityView",
    icon: <Building className="h-4 w-4" />,
    text: "Quan cảnh thành phố",
  },
  {
    id: "oceanView",
    icon: <Ship className="h-4 w-4" />,
    text: "Quan cảnh biển",
  },
  {
    id: "forestView",
    icon: <Trees className="h-4 w-4" />,
    text: "Quan cảnh rừng",
  },
  {
    id: "mountainView",
    icon: <MountainSnow className="h-4 w-4" />,
    text: "Quan cảnh núi",
  },
  {
    id: "airCondition",
    icon: <AirVent className="h-4 w-4" />,
    text: "Điều hoà",
  },
  {
    id: "soundProofed",
    icon: <VolumeX className="h-4 w-4" />,
    text: "Cách âm",
  },
];
interface RoomCardProps {
  hotel?: Hotel;
  rooms?: Room[];
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings }: RoomCardProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakFast, setIncludesBreakFast] = useState(false);
  const [days, setDays] = useState(0);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const { userId } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (date?.from && date?.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      setDays(dayCount);

      if (dayCount && room?.roomPrice) {
        if (includeBreakFast && room.breakFastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakFastPrice
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      }
    } else {
      setTotalPrice(room?.roomPrice || 0);
    }
  }, [date, room.roomPrice, includeBreakFast]);

  const handleBookRoom = () => {
    if (!userId) {
      return toast({
        variant: "destructive",
        description: "Oops! Make sure you are logged in.",
      });
    }

    if (!hotel?.userId) {
      return toast({
        variant: "destructive",
        description: "Something went wrong, refresh the page and try again!",
      });
    }

    if (date?.from && date?.to) {
      // Continue booking logic here...
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[300px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover overflow-visible"
          />
        </div>
        <CardDescription>Tiện nghi phòng</CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-row gap-2 items-center">
            <Bed className="h-4 w-4"></Bed>
            <p className="text-sm font-semibold">{room?.bedCount} giường</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Users className="h-4 w-4"></Users>
            <p className="text-sm font-semibold">{room?.guestCount} khách</p>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <BedSingle className="h-4 w-4"></BedSingle>
            <p className="text-sm font-semibold">{room?.queenBed} giường đơn</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <BedDouble className="h-4 w-4"></BedDouble>
            <p className="text-sm font-semibold">{room?.kingBed} giường đôi</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Bath className="h-4 w-4"></Bath>
            <p className="text-sm font-semibold">
              {room?.bathroomCount} phòng tắm
            </p>
          </div>
        </div>
        <Separator></Separator>
        <CardDescription>Các tiện ích</CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roomAmenities.map((item) =>
            room[item.id] ? (
              <div className="flex flex-row gap-2 items-center" key={item.id}>
                {item.icon}
                <p className="text-sm font-semibold">{item.text}</p>
              </div>
            ) : null
          )}
        </div>
        <Separator></Separator>
        <CardDescription>Giá phòng</CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <p className="text-sm font-semibold">
            Giá phòng: ${room?.roomPrice} / 24h
          </p>
          <p className="text-sm font-semibold">
            Giá bữa sáng: ${room?.breakFastPrice}
          </p>
        </div>
        <Separator></Separator>
        <CardDescription>Chọn ngày</CardDescription>
        <DatePickerWithRange
          date={date}
          setDate={setDate}
        ></DatePickerWithRange>
        <Separator></Separator>
        <p className="text-ml font-semibold">
          {days > 0 ? `Tổng tiền: ${totalPrice} cho ${days} ngày` : null}
        </p>
        <Button
          disabled={bookingIsLoading}
          type="button"
          onClick={() => handleBookRoom()}
        >
          {bookingIsLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4" />
              Loading...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Book Room
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
