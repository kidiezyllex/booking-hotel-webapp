"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import SidebarMenu from "@/components/hotel/SidebarMenu";
import { useState } from "react";
import { Hotel, Room } from "@prisma/client";
import AddHotelForm from "./AddHotelForm";
import { Undo2, Home } from "lucide-react";
interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}

export type HotelWithRooms = Hotel & { rooms: Room[] };
const sidebarItems = [
  { icon: Home, label: "Dashboard", value: "dashboard" },
  { icon: Undo2, label: "Quay lại", value: "back" },
];
export default function DashboardHotelDetails({ hotel }: AddHotelFormProps) {
  const [activeSection, setActiveSection] = useState("dashboard");
  // const renderMainContent = () => {
  //   switch (activeSection) {
  //     case "dashboard":
  //       return (
  //         <div>
  //           <p className="text-xl font-semibold text-blue-500 mb-4">
  //             KHÁCH SẠN CỦA BẠN
  //           </p>
  //           <div className="flex flex-row">
  //             {hotels.map((hotel) => (
  //               <HotelCard key={hotel.id} hotel={hotel} />
  //             ))}
  //           </div>
  //         </div>
  //       );
  //     case "create-hotel":
  //       return (
  //         <div>
  //           <p className="text-xl font-semibold text-blue-500 mb-4">
  //             TẠO KHÁCH SẠN MỚI CỦA BẠN
  //           </p>
  //           <AddHotelForm hotel={undefined}></AddHotelForm>
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div>
      <Breadcrumb className="lg:px-24 py-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-base">
              TRANG CHỦ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base text-blue-500">
              CHI TIẾT KHÁCH SẠN
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-row px-4 pr-20">
        <SidebarMenu
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarItems={sidebarItems}
        ></SidebarMenu>
        <div className="flex-grow ml-4 bg-white dark:bg-slate-900 p-6 border rounded-md">
          <p className="text-xl font-semibold text-blue-500 mb-4">
            KHÁCH SẠN: <span className="text-primary">{hotel.title}</span>
          </p>
          <AddHotelForm hotel={hotel} />
        </div>
      </div>
    </div>
  );
}
