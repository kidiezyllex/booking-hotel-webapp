"use client";
import { UserButton } from "@clerk/nextjs";
import Container from "../Container";
export default function NavBar() {
  return (
    <div className="sticky top-0 border border-b-primary/10 bg-secondary">
      <Container>
        {/* Logo */}
        {/* Search Field */}
        {/* Sign in */}
        {/* Sign up */}
        {/* User */}
        <UserButton></UserButton>
      </Container>
    </div>
  );
}
