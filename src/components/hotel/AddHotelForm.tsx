"use client";

import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import { useTranslation } from "react-i18next";

import ima from "../../../i18n/image.jpg";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadButton } from "../uploadthing";
import { useState } from "react";
import Image from "next/image";
interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}
export type HotelWithRooms = Hotel & { rooms: Room[] };
const items = [
  {
    id: "gym",
    label: "Gym",
  },
  {
    id: "spa",
    label: "Spa",
  },
  {
    id: "bar",
    label: "Bar",
  },
  {
    id: "laundry",
    label: "Laundry",
  },
  {
    id: "restaurant",
    label: "Restaurant",
  },
  {
    id: "shopping",
    label: "Shopping",
  },
  {
    id: "freeParking",
    label: "Free Parking",
  },
  {
    id: "bikeRental",
    label: "Bike Rental",
  },
  {
    id: "freeWifi",
    label: "Free Wifi",
  },
  {
    id: "movieNights",
    label: "Movie Nights",
  },
  {
    id: "swimmingPool",
    label: "Swimming Pool",
  },
  {
    id: "coffeeShop",
    label: "Coffee Shop",
  },
] as const;

const formSchema = z.object({
  //   username: z.string().min(2).max(50),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().min(1, "City is required"),
  locationDescription: z.string().optional(),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      locationDescription: "",
      items: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  // const { t } = useTranslation();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className=" flex-col grid grid-cols-1 md:grid-cols-3 gap-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Title</FormLabel>
                <FormDescription>Provide your Hotel name</FormDescription>
                <FormControl>
                  <Input
                    placeholder="Enter your Hotel name"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Description</FormLabel>
                <FormDescription>
                  Provide your Hotel description
                </FormDescription>
                <FormControl>
                  <Textarea
                    className="md:h-44"
                    placeholder="Enter your Hotel description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose Amenities</FormLabel>
                <FormDescription>
                  Choose Amenities popular in your hotel
                </FormDescription>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Image</FormLabel>
                <FormDescription>Upload your hotel image</FormDescription>
                <FormControl>
                  {image ? (
                    <>
                      <div className="w-full h-52 flex items-center justify-center py-4 relative">
                        <Image
                          layout="fill"
                          src={image}
                          alt="Hotel Image"
                          className="object-cover rounded-md"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded w-full border-dashed border-2 border-white flex items-center justify-center py-4">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            console.log("Files: ", res);
                            setImage(res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            console.log(`ERROR! ${error.message}`);
                          }}
                        />
                      </div>
                    </>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AddHotelForm;
