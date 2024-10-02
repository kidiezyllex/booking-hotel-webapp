"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@clerk/nextjs";
import {
  Calendar,
  CalendarPlus,
  CreditCard,
  Hotel,
  Menu,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

export default function DropdownMenuToggle() {
  const { userId } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 overflow-hidden" align="end">
        <DropdownMenuItem className="px-4 py-2">
          <CalendarPlus className="mr-2 h-4 w-4" />
          <Link href={`/${userId}/patient/profile`}>
            <span>Đặt khách sạn</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2">
          <Hotel className="mr-2 h-4 w-4" />
          <Link href={`/${userId}/author/dashboard`}>
            <span>Quản lý khách sạn</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Thanh toán</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
