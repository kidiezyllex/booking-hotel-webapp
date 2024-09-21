import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  BedSingle,
  Building,
  MountainSnow,
  Ship,
  Trees,
  Tv,
  Users,
  Warehouse,
  Wifi,
  VolumeX,
} from "lucide-react";
export const roomAmenities = [
  [
    {
      id: "roomService",
      icon: <Bed className="h-4 w-4" />,
      text: "Dịch vụ phòng",
    },
    {
      id: "tv",
      icon: <Tv className="h-4 w-4" />,
      text: "TV",
    },
    {
      id: "balcony",
      icon: <Warehouse className="h-4 w-4" />,
      text: "Ban công",
    },
    {
      id: "freeWifi",
      icon: <Wifi className="h-4 w-4" />,
      text: "Miễn phí Wifi",
    },
    {
      id: "cityView",
      icon: <Building className="h-4 w-4" />,
      text: "Quan cảnh thành phố",
    },
    {
      id: "oceanView",
      icon: <Ship className="h-4 w-4" />,
      text: "Quan cảnh biển",
    },
    {
      id: "forestView",
      icon: <Trees className="h-4 w-4" />,
      text: "Quan cảnh rừng",
    },
    {
      id: "mountainView",
      icon: <MountainSnow className="h-4 w-4" />,
      text: "Quan cảnh núi",
    },
    {
      id: "airCondition",
      icon: <AirVent className="h-4 w-4" />,
      text: "Điều hoà",
    },
    {
      id: "soundProofed",
      icon: <VolumeX className="h-4 w-4" />,
      text: "Cách âm",
    },
  ],
];
