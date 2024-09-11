"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import Container from "../Container";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SheetToggle } from "../SheetToggle";
export default function NavBar() {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <div className="sticky top-0 border border-b-primary/10 bg-secondary z-50">
      <Container>
        <div className="items-stretch justify-between grid grid-cols-3 gap-10">
          {/* Logo */}
          <div
            className="flex flex-row items-center gap-3"
            onClick={() => router.push("/")}
          >
            <Avatar>
              <AvatarImage
                src={
                  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1722756627/Skyline_a3z8ck.png"
                }
                alt="SKyline"
              />
            </Avatar>
            <div className="font-bold text-xl">Skyline Hotel</div>
          </div>
          {/* Search Field */}
          <div className="flex flex-row gap-2">
            <Input type="text" placeholder="Search" />
            <Button>
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
                Sign Up
              </Button>
              <Button
                onClick={() => {
                  router.push("/sign-in");
                }}
              >
                Sign In
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
              <SheetToggle></SheetToggle>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
