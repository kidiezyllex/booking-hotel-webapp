"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import Container from "../Container";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";
import DropdownMenuToggle from "../DropdownMenuToggle";

const dancingScript = Dancing_Script({ subsets: ["latin"] });
export default function NavBar() {
  const router = useRouter();
  const { userId } = useAuth();
  // user_2k7rTmzXCGyvI6dTmv0gXnH2bCB
  return (
    <div className="sticky top-0 border border-b-primary/10 bg-secondary z-50">
      <div className="max-w-[1920px] w-full mx-auto xl:px-20 px-4 py-4 bg-background dark:bg-slate-800">
        <div className="items-stretch justify-between grid grid-cols-3 gap-10">
          <Link href={"/"} className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage
                src={
                  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1722756627/Skyline_a3z8ck.png"
                }
                alt="SKyline"
              />
            </Avatar>
            <div className={`${dancingScript.className} font-bold text-3xl`}>
              Skyline Hotel
            </div>
          </Link>
          {/* Search Field */}
          <div className="flex flex-row gap-2">
            <Input type="text" placeholder="Search" />

            <Button className="border-2 border-secondary">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Sign in & Sign up & Avatar*/}
          {!userId ? (
            <div className="flex flex-row gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/sign-up");
                }}
              >
                Đăng ký
              </Button>
              <Button
                className="border-2 border-secondary"
                onClick={() => {
                  router.push("/sign-in");
                }}
              >
                Đăng nhập
              </Button>
              {/* Dark Mode */}
              <ModeToggle></ModeToggle>
            </div>
          ) : (
            <div className="flex flex-row gap-3 justify-end">
              <div className="flex items-center justify-center bg-slate-200 w-[40px] rounded-full">
                <UserButton afterSignOutUrl="/" />
              </div>

              {/* Dark Mode */}
              <ModeToggle></ModeToggle>
              <DropdownMenuToggle></DropdownMenuToggle>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
