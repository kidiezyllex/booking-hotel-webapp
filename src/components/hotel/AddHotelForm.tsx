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
import { useEffect, useState } from "react";
import Image from "next/image";
import useLocation from "../../../hook/useLocation";
import { ICity, ICountry, IState } from "country-state-city";
import { FilePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
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
  state: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  locationDescription: z.string().optional(),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
// const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
const AddHotelForm = () => {
  const router = useRouter();
  const { userId } = useAuth();

  const [image, setImage] = useState<string | undefined>(undefined);
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
      })
      .catch((err) => {
        console.log(err.message);
        // toast
      });
  }

  // const { t } = useTranslation();
  return (
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
                  <FormLabel>Hotel Image</FormLabel>
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
                  <FormLabel>Chọn Country</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setSelectedCountry(value);
                      field.onChange(getCountryByCode(value).name);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a country" />
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
                  <FormLabel>Chọn State</FormLabel>
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
                      <SelectValue placeholder="Select a state" />
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
                  <FormLabel>Chọn City</FormLabel>
                  <Select
                    disabled={cities.length < 1}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a city" />
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
                  <FormLabel>Chọn các tiện ích</FormLabel>
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
            <Button type="submit" className="flex flex-row gap-3">
              <FilePen h-4 w-4 />
              Đăng ký Khách sạn
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddHotelForm;
