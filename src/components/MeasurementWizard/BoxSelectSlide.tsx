import { useSwiper } from "swiper/react";
import { Button } from "../ui/button";
import LoginOrRegister from "../openSenseMap/LoginOrRegister";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { CheckCircleIcon, PlusCircleIcon, PointerIcon } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useOpenSenseMapAuth from "@/lib/useOpenSenseMapAuth";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Toggle } from "../ui/toggle";
import { set } from "react-hook-form";
import { Input } from "../ui/input";
import { createWaterSenseBox, getBoxes } from "@/lib/api/openSenseMapClient";

export default function BoxSelectSlide({
  updateFormData,
  position,
}: {
  updateFormData: any;
  position: any;
}) {
  const swiper = useSwiper();
  const [boxes, setBoxes] = useState<any>([]);
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [offlineMode, setOfflineMode] = useState(false);
  const [showAddBoxInput, setShowAddBoxInput] = useState(false);
  const [newBoxName, setNewBoxName] = useState("");
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  const handleBoxSelect = (box: any) => {
    if (selectedBox && selectedBox._id === box._id) {
      setSelectedBox(null);
    } else {
      setSelectedBox(box);
      updateFormData("box", box);
      updateFormData("sensors", box.sensors);
    }
  };

  useEffect(() => {
    console.log("Selected Box:", selectedBox);
    console.log("Token", useAuthStore.getState().token);
  }, [selectedBox]);

  useEffect(() => {
    // Simulating an API call to fetch boxes with grouptag "AI.CAN"

    async function fetchBoxes() {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await getBoxes();
        console.log(response);
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

  const handleAddBox = async () => {
    if (newBoxName.trim()) {
      try {
        const newBox = await createWaterSenseBox(
          newBoxName,
          position.latitude,
          position.longitude
        );
        setBoxes([...boxes, newBox]);
        setNewBoxName("");
        setShowAddBoxInput(false);
        updateFormData("box", newBox);
      } catch (error: any) {
        console.error("Error adding box:", error.message);
      }
    }
  };

  const handleOfflineModeChange = (event: any) => {
    setOfflineMode(event.target.value === "offline");
  };

  return (
    <div className="flex flex-col h-screen justify-center ">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center">
          openSenseMap Anbindung
        </h1>
        <p className="text-gray-600 text-center">
          Melde dich mit deinem openSenseMap Account an, wenn du die Daten
          online haben willst, oder wähle den Offline Modus aus!
        </p>
        <div className="flex justify-center mt-6">
          <Toggle
            className="flex flex-row gap-4"
            onPressedChange={setOfflineMode}
            size="lg"
          >
            <PointerIcon />
            {offlineMode ? "Offline Modus" : "Online Modus"}
          </Toggle>
        </div>
        <div className="flex justify-center p-4">
          <AnimatePresence mode="wait">
            {!alreadyLoggedIn ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
              >
                <Card>
                  <CardHeader></CardHeader>
                  <CardContent>
                    <LoginOrRegister setAlreadyLoggedIn={setAlreadyLoggedIn} />
                  </CardContent>
                </Card>
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
                            onClick={() => handleBoxSelect(box)}
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
                              <Button
                                variant={"outline"}
                                onClick={handleAddBox}
                              >
                                <PlusCircleIcon />
                              </Button>
                            </motion.div>
                          )}
                        </li>
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={() => swiper.slidePrev()}>Zurück</Button>
        <Button
          disabled={selectedBox !== null ? false : true}
          onClick={() => swiper.slideNext()}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
}
