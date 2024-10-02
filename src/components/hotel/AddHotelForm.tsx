"use client";
import axios from "axios";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
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
import AddRoomForm from "../room/AddRoomForm";
import RoomCard from "../room/RoomCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hotelAmenities } from "./data";

interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}

export type HotelWithRooms = Hotel & { rooms: Room[] };

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional(),
  provinces: z.string().min(1, "Provinces is required"),
  districts: z.string().min(1, "Districts is required"),
  locationDescription: z.string().optional(),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const router = useRouter();
  const { userId } = useAuth();
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [provincesList, setProvincesList] = useState<[]>([]);
  const [districtsList, setDistrictsList] = useState<[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      provinces: "",
      districts: "",
      locationDescription: "",
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

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=2"
      );
      setProvincesList(response.data);
    };

    fetchProvinces();
  }, []);

  const handleFetchDistricts = async (provincesName: string) => {
    const provincesCode = parseInt(provincesName?.match(/\d+/)[0]);

    const provincesByCode = provincesList.find(
      (item) => (item as any).code === provincesCode
    );
    console.log((provincesByCode as any).districts);
    setDistrictsList((provincesByCode as any).districts);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const amenities = {
      gym: values.items.includes("gym"),
      spa: values.items.includes("spa"),
      bar: values.items.includes("bar"),
      laundry: values.items.includes("laundry"),
      restaurant: values.items.includes("restaurant"),
      shopping: values.items.includes("shopping"),
      freeParking: values.items.includes("freeParking"),
      bikeRental: values.items.includes("bikeRental"),
      freeWifi: values.items.includes("freeWifi"),
      movieNights: values.items.includes("movieNights"),
      swimmingPool: values.items.includes("swimmingPool"),
      coffeeShop: values.items.includes("coffeeShop"),
    };
    const { items, ...newValue } = values;
    const payload = {
      userId,
      ...newValue,
      ...amenities,
      addedAt: new Date(),
      updatedAt: new Date(),
    };
    axios
      .post("/api/hotel", payload)
      .then((res) => {
        // toast
        router.push(`/${userId}/hotel/list`);
      })
      .catch((err) => {
        console.log(err.message);
        // toast
      });
  }

  const handleDeleteHotel = async (hotel: HotelWithRooms) => {
    // setIsHotelDeleting(true);

    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);

    try {
      const imageKey = getImageKey(hotel.image);

      // Delete the image first
      await axios.post("/api/uploadthing/delete", { imageKey });

      // Delete the hotel record
      await axios.delete(`/api/hotel/${hotel.id}`);
      router.push("/hotel/new");

      // setIsHotelDeleting(false);

      // Show success message
      // toast({
      //   variant: "success",
      //   description: "Hotel Deleted!",
      // });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDialogOpen = () => {
    // setOpen((prev)=> !prev)
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=" flex-col grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin cơ bản */}
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="font-bold text-xl">
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên Khách sạn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Hotel name"
                            {...field}
                            className="w-full"
                            value={hotel?.title}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả Khách sạn</FormLabel>
                        {hotel?.description ? (
                          <p className="text-zinc-400">
                            {hotel.description.length > 100
                              ? `${hotel.description.substring(
                                  0,
                                  150
                                )}...Xem thêm`
                              : hotel.description}
                          </p>
                        ) : (
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Enter your Hotel description"
                              {...field}
                              value={hotel?.description}
                            />
                          </FormControl>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Vị trí */}
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="font-bold text-xl">Vị trí</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="provinces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chọn Tỉnh/Thành phố</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleFetchDistricts(value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            {hotel?.provinces ? (
                              <SelectValue placeholder={hotel.provinces} />
                            ) : (
                              <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {provincesList &&
                                provincesList.map((item) => {
                                  return (
                                    <SelectItem
                                      key={item.code}
                                      value={item.name + `(${item.code})`}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  );
                                })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="districts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chọn Quận/Huyện/Thị xã</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // const districtsList = provincesList.filter(
                            //   (item) => (item.code = value)
                            // );
                            // setDistrictsList(districtsList);
                            // console.log(districtsList);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            {hotel?.districts ? (
                              <SelectValue placeholder={hotel.districts} />
                            ) : (
                              <SelectValue placeholder="Chọn Quận/Huyện/Thị xã" />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {districtsList &&
                                districtsList.map((item) => {
                                  return (
                                    <SelectItem
                                      key={item.code}
                                      value={item.name}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  );
                                })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="locationDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả vị trí</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Enter your Location Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Ảnh khách sạn */}
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="font-bold text-xl">
                  Ảnh khách sạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {image ? (
                          <>
                            <div className="w-full h-72 flex items-center justify-center py-4 relative">
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
              </CardContent>
            </Card>
            {/* Tiện nghi */}
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="font-bold text-xl">
                  Tiện ích/Tiện nghi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      {!hotel?.items && hotel ? (
                        <div className="grid grid-cols-2 gap-6 mt-2">
                          {hotelAmenities.map((item) =>
                            hotel[item.id] ? (
                              <div
                                className="flex flex-row gap-2 items-center"
                                key={item.id}
                              >
                                {item.icon}
                                <p className="text-sm font-semibold">
                                  {item.text}
                                </p>
                              </div>
                            ) : null
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-6 mt-2">
                          {hotelAmenities.map((item) => (
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
                                            ? field.onChange([
                                                ...field.value,
                                                item.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.text}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-row gap-3 justify-center mt-10">
            {hotel ? null : (
              <Button type="submit" className="flex flex-row gap-3">
                <FilePen h-4 w-4 />
                Đăng ký khách sạn
              </Button>
            )}
          </div>
        </form>
      </Form>
      {hotel && (
        <div className="flex flex-row gap-10 justify-center mt-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button type="submit" className="flex flex-row gap-3">
                <HousePlus h-4 w-4 />
                Thêm phòng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[900px] w-[90%]">
              <DialogHeader>
                <DialogTitle>Thêm phòng cho Khách sạn</DialogTitle>
              </DialogHeader>
              <AddRoomForm
                handleDialogOpen={handleDialogOpen}
                hotel={hotel}
              ></AddRoomForm>
            </DialogContent>
          </Dialog>
          <Button type="submit" className="flex flex-row gap-3">
            <Pencil h-4 w-4 />
            Cập nhật khách sạn
          </Button>
          <Button type="submit" className="flex flex-row gap-3">
            <Trash2 h-4 w-4 />
            Xoá khách sạn
          </Button>
        </div>
      )}

      {hotel && hotel?.rooms?.length > 0 && (
        <div>
          <Separator className="mt-10 bg-slate-600" />
          <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotel.rooms.map((room) => (
              <RoomCard key={room.id} hotel={hotel} room={room} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddHotelForm;
