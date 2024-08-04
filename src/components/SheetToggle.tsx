import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  FilePen,
  Hotel,
  HotelIcon,
  Menu,
  MessageSquareText,
} from "lucide-react";

export function SheetToggle() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Khách sạn của bạn</SheetTitle>
        </SheetHeader>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <Hotel h-4 w-4 />
          Xem Khách sạn của bạn
        </Button>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <FilePen h-4 w-4 />
          Đăng ký Khách sạn của bạn
        </Button>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <FilePen h-4 w-4 /> Cập nhật thông tin Khách sạn
        </Button>
        <Button
          className="w-full my-5 flex flex-row justify-start gap-3"
          variant="outline"
        >
          <MessageSquareText h-4 w-4 />
          Xem đánh giá từ Khách hàng
        </Button>
        <SheetHeader>
          <SheetTitle>Đặt phòng</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
