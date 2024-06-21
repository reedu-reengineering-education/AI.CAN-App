"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Browser } from "@capacitor/browser";
import {
  Bars3Icon,
  BeakerIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowLeftIcon,
  InfoIcon,
  LogInIcon,
  UserCog,
  WaypointsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { useAuthStore } from "@/lib/store/useAuthStore";

const titles: Record<string, string> = {
  "/": "",
  "/tracks": "Tracks",
};

const TopBar = () => {
  const pathname = usePathname();
  const loggedIn = useAuthStore((state) => state.isLoggedIn);
  const isHome = pathname === "/";

  return (
    <div className="pointer-events-auto sticky top-0 z-10 flex w-full items-center justify-between px-4 pt-2 landscape:px-safe-or-4">
      <div className="flex items-center gap-2">
        {!isHome && (
          <Link href="/">
            <ArrowLeftIcon className="h-7 w-7" />
          </Link>
        )}
        <h1 className="text-xl">{titles[pathname]}</h1>
      </div>
      <div className="flex flex-col-reverse gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"}>
              <Bars3Icon className="h-7" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 p-2 mr-safe-or-2">
            <Link href="/login">
              <DropdownMenuItem>
                <LogInIcon className="mr-2 h-7 w-7" /> Login
              </DropdownMenuItem>
            </Link>
            {loggedIn ? (
              <Link href="/settings">
                <DropdownMenuItem>
                  <UserCog className="mr-2 h-7 w-7" /> Settings
                </DropdownMenuItem>
              </Link>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export { TopBar };
