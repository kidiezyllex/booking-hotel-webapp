"use client";
import { Button } from "@/components/ui/button";
import Hotel from "./hotel/[hotelId]/page";
import { PagesTopLoader } from "nextjs-toploader/pages";

export default function Home() {
  return (
    <div>
      <PagesTopLoader />
      {/* <Hotel
        params={{
          hotelId: 0,
        }}
      ></Hotel> */}
    </div>
  );
}
