"use client";
import React from "react";
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
} from "lucide-react";
interface RoomCardProps {
  hotel?: Hotel;
  rooms?: Room[];
  room: Room;
  bookings?: Booking[];
}

const items = [
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
] as const;

const RoomCard = ({ hotel, room, bookings }: RoomCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
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
        <CardDescription>Các tiện ích</CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) =>
            room[item.id] ? (
              <div className="flex flex-row gap-2 items-center">
                {item.icon}
                <p className="text-sm font-semibold">{item.text}</p>
              </div>
            ) : null
          )}
        </div>
        <CardDescription>Giá phòng</CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <p className="text-sm font-semibold">
            Giá phòng: ${room?.roomPrice} / 24h
          </p>
          <p className="text-sm font-semibold">
            Giá bữa sáng: ${room?.breakFastPrice}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
