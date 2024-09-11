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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import useLocation from "../../../hook/useLocation";
import { ICity, ICountry, IState } from "country-state-city";
import { FilePen, Hospital, HousePlus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import AddRoomForm from "../room/AddRoomForm";
interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}
export type HotelWithRooms = Hotel & { rooms: Room[] };
const items = [
  {
    id: "gym",
    label: "Phòng Gym",
  },
  {
    id: "spa",
    label: "Phòng Spa",
  },
  {
    id: "bar",
    label: "Quầy bar",
  },
  {
    id: "laundry",
    label: "Giặt ủi",
  },
  {
    id: "restaurant",
    label: "Nhà hàng",
  },
  {
    id: "shopping",
    label: "Mua sắm",
  },
  {
    id: "freeParking",
    label: "Đỗ xe miễn phí",
  },
  {
    id: "bikeRental",
    label: "Thuê xe đạp",
  },
  {
    id: "freeWifi",
    label: "Wifi miễn phí",
  },
  {
    id: "movieNights",
    label: "Xem phim",
  },
  {
    id: "swimmingPool",
    label: "Hồ bơi",
  },
  {
    id: "coffeeShop",
    label: "Tiệm cafe",
  },
] as const;

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  locationDescription: z.string().optional(),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  // console.log(hotel);
  const router = useRouter();
  const { userId } = useAuth();

  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [selectedCountry, setSelectedCountry] = useState<ICountry[]>([]);
  const [selectedState, setSelectedState] = useState<IState[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const {
    getAllCountries,
    getStateCities,
    getCountryStates,
    getStateByCode,
    getCountryByCode,
  } = useLocation();
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

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [image]);

  useEffect(() => {
    setStates(getCountryStates(selectedCountry));
  }, [selectedCountry]);

  useEffect(() => {
    const stateCities = getStateCities(selectedCountry, selectedState);
    setCities(stateCities);
  }, [selectedState]);

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
        router.push(`/hotel/${res.data.id}`);
        console.log(res.data.id);
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

  // const { t } = useTranslation();
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className=" flex-col grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col gap-6">
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả Khách sạn</FormLabel>
                    <FormControl>
                      <Textarea
                        className="md:h-32"
                        placeholder="Enter your Hotel description"
                        {...field}
                        value={hotel?.description}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh khách sạn</FormLabel>
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
            </div>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn Nước (Country)</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setSelectedCountry(value);
                        field.onChange(getCountryByCode(value).name);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        {hotel?.country ? (
                          <SelectValue placeholder={hotel.country} />
                        ) : (
                          <SelectValue placeholder="Select a country" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {getAllCountries.map((country) => {
                            return (
                              <SelectItem
                                key={country.isoCode}
                                value={country.isoCode}
                              >
                                {country.name}
                                {/* {hotel?.country ? hotel.country : country.name} */}
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
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Chọn Tỉnh/ Thành phố/ Tiểu bang (City/ State)
                    </FormLabel>
                    <Select
                      disabled={selectedCountry.length < 1}
                      onValueChange={(value) => {
                        setSelectedState(value);
                        field.onChange(
                          getStateByCode(selectedCountry.toString(), value).name
                        );
                      }}
                    >
                      <SelectTrigger className="w-full">
                        {hotel?.state ? (
                          <SelectValue placeholder={hotel.state} />
                        ) : (
                          <SelectValue placeholder="Select a state" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {states.map((state) => {
                            return (
                              <SelectItem
                                key={state.isoCode}
                                value={state.isoCode}
                              >
                                {state.name}
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
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn Huyện/ Quận (District)</FormLabel>
                    <Select
                      disabled={cities.length < 1}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        {hotel?.city ? (
                          <SelectValue placeholder={hotel.city} />
                        ) : (
                          <SelectValue placeholder="Select a city" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {cities.map((city) => {
                            return (
                              <SelectItem key={city.name} value={city.name}>
                                {city.name}
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
              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả vị trí</FormLabel>
                    <FormControl>
                      <Textarea
                        className="md:h-32"
                        placeholder="Enter your Location Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col justify-between">
              <FormField
                control={form.control}
                name="title"
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
              <div className="flex flex-row gap-3 justify-between mt-5">
                {hotel ? null : (
                  <Button type="submit" className="flex flex-row gap-3">
                    <FilePen h-4 w-4 />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
      {hotel && (
        <div className="flex flex-row gap-10 justify-center mt-16">
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
                {/* <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription> */}
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
    </div>
  );
};

export default AddHotelForm;
