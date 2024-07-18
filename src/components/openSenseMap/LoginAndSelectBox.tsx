"use client";

import { motion, AnimatePresence } from "framer-motion";
import LoginOrRegister from "../openSenseMap/LoginOrRegister";
import { Button } from "../ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BoxSelect from "./BoxSelect";
import { useEffect, useState } from "react";

export default function LoginAndSelectBox({}: {}) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();
  const selectedBox = useAuthStore((state) => state.selectedBox);
  const handleContinue = () => {
    // Handle the continue action here
    console.log("Selected box:", selectedBox);
    router.push("/map");
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <LoginOrRegister />
          </motion.div>
        ) : (
          <motion.div
            key="boxselect"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <BoxSelect />
            <div className="flex flex-col w-full">
              <Button
                onClick={handleContinue}
                className="mt-4"
                disabled={!selectedBox}
              >
                Weiter
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/map"
          className="underline underline-offset-4"
          prefetch={false}
        >
          Ohne Anmelden fortfahren
        </Link>
      </div>
    </div>
  );
}
