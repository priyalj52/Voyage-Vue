"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import Container from "../Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchBox from "../Search";
import { ModeToggle } from "../ThemeToggle";
import { NavMenu } from "./NavMenu";
export default function Navbar() {
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <div className="sticky top-0 border border-b-primary/10 bg-secondary">
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image src="/./logo.ico" alt="alt" height="50" width="50" />
            <div className="font-bold text-xl">Voyage Vue</div>
          </div>
          <div>
            <SearchBox />
          </div>

          <div className="flex gap-3 items-center">
            <div>
              <ModeToggle />
              <NavMenu />
            </div>
            {!userId && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/sign-in")}
                >
                  Sign In
                </Button>
                <Button size="sm" onClick={() => router.push("/sign-up")}>
                  Sign Up
                </Button>
              </>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </Container>
    </div>
  );
}
