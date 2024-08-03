"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import Container from "../Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
export default function NavBar() {
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <div
      className="sticky top-0 border border-b-primary/10 bg-secondary"
      onClick={() => router.push("/")}
    >
      <Container>
        <div className="flex flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex flex-row gap-1 items-center">
            {/* <Image src="/../logo.png" alt="logo" width="30" height="30"></Image> */}
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
          {!userId && (
            <div className="flex flex-row gap-3">
              <Button variant="outline" onClick={() => router.push("/sign-up")}>
                Sign Up
              </Button>
              <Button onClick={() => router.push("/sign-up")}>Sign In</Button>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>Kidie</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        {/* <UserButton></UserButton> */}
      </Container>
    </div>
  );
}
