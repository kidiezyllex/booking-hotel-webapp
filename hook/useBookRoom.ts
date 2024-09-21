import { Room } from "@prisma/client";
import { create, StateCreator } from "zustand";
// Import middleware persist và kiểu PersistOptions từ Zustand
import { persist, PersistOptions } from "zustand/middleware";

// Định nghĩa một kiểu tùy chỉnh cho dữ liệu đặt phòng
type RoomDataType = {
  room: Room;
  totalPrice: number;
  breakfastIncluded: boolean;
  startDate: Date;
  endDate: Date;
};

// Định nghĩa interface cho store đặt phòng
interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  paymentIntentId: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntentId: (paymentIntentId: string) => void;
  setClientSecret: (clientSecret: string) => void;
  resetBookRoom: () => void;
}

// Định nghĩa kiểu cho cấu hình middleware persist
// Điều này cần thiết để đảm bảo kiểu dữ liệu chính xác khi sử dụng persist với Zustand
type BookRoomPersist = (
  config: StateCreator<BookRoomStore>,
  options: PersistOptions<BookRoomStore>
) => StateCreator<BookRoomStore>;

const useBookRoom = create<BookRoomStore>(
  // Ép kiểu persist thành BookRoomPersist để đảm bảo kiểu dữ liệu chính xác
  (persist as unknown as BookRoomPersist)(
    // Định nghĩa state và các action của store
    (set) => ({
      // Trạng thái ban đầu
      bookingRoomData: null,
      paymentIntentId: null,
      clientSecret: undefined,

      // Action để cập nhật
      setRoomData: (data) => set(() => ({ bookingRoomData: data })),
      setPaymentIntentId: (paymentIntentId) => set(() => ({ paymentIntentId })),
      setClientSecret: (clientSecret) => set(() => ({ clientSecret })),

      // Action để đặt lại store về trạng thái ban đầu
      resetBookRoom: () =>
        set(() => ({
          bookingRoomData: null,
          paymentIntentId: null,
          clientSecret: undefined,
        })),
    }),
    // Cấu hình cho middleware persist
    { name: "book-room-storage" }
  )
);

export default useBookRoom;
