import { Room } from "@prisma/client";
import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
type RoomDataType = {
  room: Room;
  totalPrice: number;
  breakfastIncluded: boolean;
  startDate: Date;
  endDate: Date;
};

interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  paymentIntent: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntent: (paymentIntent: string) => void;
  setClientSecret: (clientSecret: string) => void;
  resetBookRoom: () => void;
}

// Define persist configuration
type BookRoomPersist = (
  config: StateCreator<BookRoomStore>,
  options: PersistOptions<BookRoomStore>
) => StateCreator<BookRoomStore>;

const useBookRoom = create<BookRoomStore>(
  (persist as BookRoomPersist)(
    (set) => ({
      bookingRoomData: null,
      paymentIntent: null,
      clientSecret: undefined,
      setRoomData: (data) => set(() => ({ bookingRoomData: data })),
      setPaymentIntent: (paymentIntent) => set(() => ({ paymentIntent })),
      setClientSecret: (clientSecret) => set(() => ({ clientSecret })),
      resetBookRoom: () =>
        set(() => ({
          bookingRoomData: null,
          paymentIntent: null,
          clientSecret: undefined,
        })),
    }),
    { name: "book-room-storage" }
  )
);

export default useBookRoom;
