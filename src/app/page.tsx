import { Button } from "@/components/ui/button";
import Hotel from "./hotel/[hotelId]/page";

export default function Home() {
  return (
    <div>
      <Hotel
        params={{
          hotelId: "",
        }}
      ></Hotel>
    </div>
  );
}
