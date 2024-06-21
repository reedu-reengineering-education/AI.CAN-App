"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Welcome from "./Welcome";
import { Navigation, Pagination } from "swiper/modules";
import WizardSlide from "./WizardSlide";
import { useAuthStore } from "@/lib/store/useAuthStore";
import LoginOrRegister from "../openSenseMap/LoginOrRegister";
import BluetoothSlide from "./BluetoothSlide";
import useSenseBox from "@/lib/useSenseBox";
import MeasurementSlide from "./MeasurementSlide";
import WaterWayFormSlide from "./WaterwayFormSlide";
import OverviewSlide from "./OverviewSlide";
import PositionSelect from "./PositionSelect";
import BoxSelectSlide from "./BoxSelectSlide";

export default function Wizard() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { connect, isConnected, disconnect } = useSenseBox();

  // State to hold all the data collected from the slides
  const [formData, setFormData] = useState({
    box: null,
    sensors: {}, 
    position: null,
    ph: 0,
    temperature: 0,
    conductivity: 0,
    development: null,
    weather: null,
    smell: null,
    color: null,
    wind: null,
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Function to update formData
  const updateFormData = (field: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    console.log(formData);
  };

  return (
    <Swiper
      spaceBetween={48}
      modules={[Navigation, Pagination]}
      slidesPerView={1}
      threshold={20}
      allowTouchMove={false}
    >
      <SwiperSlide>
        <WizardSlide>
          <Welcome />
        </WizardSlide>
      </SwiperSlide>
      <SwiperSlide>
        <WizardSlide>
          <PositionSelect updateFormData={updateFormData} />
        </WizardSlide>
      </SwiperSlide>
      <SwiperSlide>
        <WizardSlide>
          <BoxSelectSlide
            position={formData.position}
            updateFormData={updateFormData}
          />
        </WizardSlide>
      </SwiperSlide>
      {isConnected ? (
        <SwiperSlide>
          <WizardSlide>
            <BluetoothSlide updateFormData={updateFormData} />
          </WizardSlide>
        </SwiperSlide>
      ) : null}

      <SwiperSlide>
        <WizardSlide>
          <MeasurementSlide formData={formData} updateFormData={updateFormData} />
        </WizardSlide>
      </SwiperSlide>
      <SwiperSlide>
        <WizardSlide>
          <WaterWayFormSlide updateFormData={updateFormData} />
        </WizardSlide>
      </SwiperSlide>
      <SwiperSlide>
        <WizardSlide>
          <OverviewSlide formData={formData} />
        </WizardSlide>
      </SwiperSlide>
    </Swiper>
  );
}
