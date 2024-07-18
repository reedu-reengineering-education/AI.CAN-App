"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import WaterWayFormSlide from "./WaterwayFormSlide";
import OverviewSlide from "./OverviewSlide";
import RecordMeasurement from "./RecordMeasurement";
import { useRouter } from "next/navigation";

interface FormData {
  box: any;
  sensors: Record<string, any>;
  position: any;
  ph: number;
  temperature: number;
  conductivity: number;
  development: any;
  weather: any;
  smell: any;
  color: any;
  wind: any;
  time: string;
}

export default function Wizard() {
  const router = useRouter();

  // State to hold all the data collected from the slides
  const defaultFormData: FormData = {
    box: null,
    sensors: {},
    position: { latitude: 53.041959805718506, longitude: 14.326863173855571 },
    ph: 0,
    temperature: 0,
    conductivity: 0,
    development: 0,
    weather: 0,
    smell: 0,
    color: 0,
    wind: 0,
    time: new Date().toISOString(),
  };

  const [formData, setFormData] = useState<FormData>(defaultFormData);
  // State to hold all the data collected from the slides

  // Function to update formData
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    // Handle the cancel action here
    setFormData(defaultFormData);
    router.push("/map");
  };

  return (
    <Swiper
      spaceBetween={48}
      modules={[Navigation, Pagination]}
      slidesPerView={1}
      threshold={20}
      allowTouchMove={false}
    >
      <SwiperSlide className="p-4">
        <RecordMeasurement
          updateFormData={updateFormData}
          formData={formData}
        />
      </SwiperSlide>
      <SwiperSlide className="p-4">
        <WaterWayFormSlide updateFormData={updateFormData} />
      </SwiperSlide>
      <SwiperSlide className="p-4">
        <OverviewSlide formData={formData} />
      </SwiperSlide>
    </Swiper>
  );
}
