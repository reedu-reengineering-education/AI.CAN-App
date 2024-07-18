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
  Calculator,
  CircleHelpIcon,
  GlobeIcon,
  InfoIcon,
  LogInIcon,
  LogOutIcon,
  UserCog,
  WaypointsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Dialog, DialogContent, DialogHeader } from "./dialog";
import { useEffect, useState } from "react";
import useOpenSenseMapAuth from "@/lib/useOpenSenseMapAuth";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useToast } from "./use-toast";

const titles: Record<string, string> = {
  "/": "",
  "/tracks": "Tracks",
};

const TopBarLeft = () => {
  const pathname = usePathname();
  const loggedIn = useAuthStore((state) => state.isLoggedIn);
  const { toast } = useToast();
  const { logout } = useOpenSenseMapAuth();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const isHome = pathname === "/";


  const handleConfirmLogout = async () => {
    setConfirmDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logout erfolgreich", duration: 1000 });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout fehlgeschlagen",
        variant: "destructive",
        duration: 1000,
      });
    }
    setConfirmDialogOpen(false);
  };
  return (
    <div className="pointer-events-auto sticky top-0 z-10 flex w-full items-center justify-between px-4 pt-2 landscape:px-safe-or-4">
      <div className="flex flex-col-reverse gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"}>
              <Bars3Icon className="h-7" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 p-2 mr-safe-or-2">
            <Link href="/about">
              <DropdownMenuItem>
                <CircleHelpIcon className="mr-2 h-7 w-7" />
                <span>Tutorials</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/about">
              <DropdownMenuItem>
                <GlobeIcon className="mr-2 h-7 w-7" />
                <span>SensorCommunity</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/about">
              <DropdownMenuItem>
                <Calculator className="mr-2 h-7 w-7" />
                <span>Kalibrierung</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export { TopBarLeft };
