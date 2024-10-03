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
import HotelCard from "./HotelCard";
import AddHotelForm from "./AddHotelForm";
import { Bell, Clock, FolderClosed, Home, Plus } from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", value: "dashboard" },
  { icon: Plus, label: "Tạo khách sạn", value: "create-hotel" },
  { icon: Bell, label: "Notifications" },
  { icon: Clock, label: "History" },
  { icon: FolderClosed, label: "Documents" },
];
export default function Dashboard({ hotels }: { hotels: [] }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <p className="text-xl font-semibold text-blue-500 mb-4">
              KHÁCH SẠN CỦA BẠN
            </p>
            <div className="flex flex-row">
              {hotels.map((hotel) => (
                <HotelCard key={(hotel as any).id} hotel={hotel} />
              ))}
            </div>
          </div>
        );
      case "create-hotel":
        return (
          <div>
            <p className="text-xl font-semibold text-blue-500 mb-4">
              TẠO KHÁCH SẠN MỚI CỦA BẠN
            </p>
            <AddHotelForm hotel={null} bookings={null}></AddHotelForm>
          </div>
        );
      default:
        return null;
    }
  };

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
              QUẢN LÝ KHÁCH SẠN
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
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
