"use client";
import React from "react";
import { Hotel, Room } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useEffect, useState } from "react";
import Image from "next/image";
import { FilePen, Hospital, HousePlus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
interface AddRoomFormProps {
  hotel?: Hotel;
  room?: Room;
  handleDialogOpen: (hotel?: Hotel, room?: Room) => void;
}

const items = [
  {
    id: "roomService",
    label: "roomService",
  },
  {
    id: "tv",
    label: "tv",
  },
  {
    id: "balcony",
    label: "balcony",
  },
  {
    id: "freeWifi",
    label: "freeWifi",
  },
  {
    id: "cityView",
    label: "cityView",
  },
  {
    id: "oceanView",
    label: "oceanView",
  },
  {
    id: "forestView",
    label: "forestView",
  },
  {
    id: "mountainView",
    label: "mountainView",
  },
  {
    id: "airCondition",
    label: "airCondition",
  },
  {
    id: "soundProofed",
    label: "soundProofed",
  },
] as const;
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }),
  bedCount: z.coerce.number().min(1, {
    message: "Bed count is required.",
  }),
  guestCount: z.coerce.number().min(1, {
    message: "Guest count is required.",
  }),
  bathroomCount: z.coerce.number().min(1, {
    message: "Bathroom count is required.",
  }),
  kingBed: z.coerce.number().min(0),
  queenBed: z.coerce.number().min(0),
  image: z.string().min(1, {
    message: "Image is required.",
  }),
  breakFastPrice: z.coerce.number().optional(),
  roomPrice: z.coerce.number().min(1, {
    message: "Room price is required.",
  }),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
export default function AddRoomForm({
  hotel,
  room,
  handleDialogOpen,
}: AddRoomFormProps) {
  const [image, setImage] = useState<string | undefined>(room?.image);
  const router = useRouter();
  const { userId } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      queenBed: 0,
      image: "",
      breakFastPrice: 0,
      roomPrice: 0,
      items: [],
    },
  });

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [image, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const amenities = {
      roomService: values.items.includes("roomService"),
      tv: values.items.includes("tv"),
      balcony: values.items.includes("balcony"),
      freeWifi: values.items.includes("freeWifi"),
      cityView: values.items.includes("cityView"),
      oceanView: values.items.includes("oceanView"),
      forestView: values.items.includes("forestView"),
      mountainView: values.items.includes("mountainView"),
      airCondition: values.items.includes("airCondition"),
      soundProofed: values.items.includes("soundProofed"),
    };
    const { items, ...newValue } = values;
    if (!hotel) return;
    const payload = {
      hotelId: hotel.id,
      ...newValue,
      ...amenities,
    };

    axios
      .post("/api/room", payload)
      .then((res) => {
        // toast
        router.push(`${userId}/hotel/${res.data.hotelId}`);
        console.log(res.data.id);
      })
      .catch((err) => {
        console.log(err.message);
        // toast
      });
  }
  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên Phòng</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" value={room?.title} />
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
                <FormLabel>Mô tả phòng</FormLabel>
                <FormControl>
                  <Textarea
                    className="md:h-24"
                    placeholder="Enter your Room Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Các tiện ích</FormLabel>
                <div className="grid grid-cols-2 gap-6 mt-2">
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                className="h-5 w-5"
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

          {/* image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh phòng</FormLabel>
                <FormControl>
                  {image ? (
                    <>
                      <div className="w-full h-52 flex items-center justify-center py-4 relative">
                        <Image
                          layout="fill"
                          src={hotel?.image ? hotel?.image : image}
                          alt="Hotel Image"
                          className="object-cover rounded-md"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-32 rounded w-full border-dashed border-2 border-white flex items-center justify-center py-4">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
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
          <div className=" flex-col grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="bedCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng giường</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      value={room?.bedCount}
                      type="number"
                      min={0}
                      max={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng khách</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      value={room?.guestCount}
                      type="number"
                      min={0}
                      max={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathroomCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng phòng tắm</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      value={room?.bathroomCount}
                      type="number"
                      min={0}
                      max={3} // Điều chỉnh giới hạn nếu cần
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kingBed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giường cỡ lớn (King)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      value={room?.kingBed}
                      type="number"
                      min={0}
                      max={2} // Điều chỉnh giới hạn nếu cần
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="queenBed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giường cỡ vừa (Queen)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      value={room?.queenBed}
                      type="number"
                      min={0}
                      max={2} // Điều chỉnh giới hạn nếu cần
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breakFastPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá bữa sáng</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      value={room?.breakFastPrice}
                      type="number"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá phòng</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      value={room?.roomPrice}
                      type="number"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="flex flex-row gap-3">
            <HousePlus h-4 w-4 />
            Thêm phòng
          </Button>
        </form>
      </Form>
    </div>
  );
}
