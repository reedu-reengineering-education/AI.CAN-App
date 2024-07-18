"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { motion } from "framer-motion";
import { CheckCircleIcon, PlusCircleIcon, PointerIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { createWaterSenseBox, getBoxes } from "@/lib/api/openSenseMapClient";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function BoxSelect() {
  const [newBoxName, setNewBoxName] = useState("");
  const [showAddBoxInput, setShowAddBoxInput] = useState(false);
  const [boxes, setBoxes] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { setSelectedBox } = useAuthStore();
  const selectedBox = useAuthStore((state) => state.selectedBox);
  useEffect(() => {
    // Simulating an API call to fetch boxes with grouptag "AI.CAN"
    async function fetchBoxes() {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await getBoxes();
        setBoxes(response.boxes);
      } catch (error) {
        console.error("Error fetching boxes:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isLoggedIn) {
      fetchBoxes();
    }
  }, [isLoggedIn]);

  const handleBoxClick = (box: any) => {
    if (selectedBox && selectedBox._id === box._id) {
      setSelectedBox(undefined);
    } else {
      setSelectedBox(box);
    }
  };

  const handleAddBox = async () => {
    if (newBoxName.trim()) {
      try {
        const getPosition = (): Promise<GeolocationPosition> => {
          return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
        };
        const position = await getPosition();
        const { latitude, longitude } = position.coords;
        const newBox = await createWaterSenseBox(
          newBoxName,
          latitude,
          longitude
        );
        setBoxes([...boxes, newBox]);
        setNewBoxName("");
        setShowAddBoxInput(false);
      } catch (error: any) {
        console.error("Error adding box:", error.message);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Box auswählen</CardTitle>{" "}
        <CardDescription>
          Wähle die Box aus auf die hochgeladen werden soll.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-40 overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {boxes.map((box: any) => (
              <li
                key={box._id}
                className={`flex items-center justify-between p-2 rounded-md font-semibold border-b  cursor-pointer ${
                  selectedBox && selectedBox._id === box._id
                    ? "bg-green-100"
                    : ""
                }`}
                onClick={() => handleBoxClick(box)}
              >
                <span>{box.name}</span>
                {selectedBox && selectedBox._id === box._id && (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                )}
              </li>
            ))}
            <li className="flex items-center justify-between p-2  cursor-pointer">
              {!showAddBoxInput ? (
                <div
                  className="flex items-center"
                  onClick={() => setShowAddBoxInput(true)}
                >
                  <PlusCircleIcon className="w-6 h-6 text-gray-500 mr-2" />
                  <span>Neue Box hinzufügen</span>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-row gap-2 "
                >
                  <Input
                    type="text"
                    value={newBoxName}
                    onChange={(e) => setNewBoxName(e.target.value)}
                    placeholder="Name der neuen Box"
                    className="p-2 border rounded mb-2"
                  />
                  <Button variant={"outline"} onClick={handleAddBox}>
                    <PlusCircleIcon />
                  </Button>
                </motion.div>
              )}
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
