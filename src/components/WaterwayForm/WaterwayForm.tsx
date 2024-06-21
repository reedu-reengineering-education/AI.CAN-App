import WindSelect from "./WindSelect";
import WeatherSelect from "./WeatherSelect";
import DevelopmentSelect from "./DevelopmentSelect";
import SmellIntensitySelect from "./SmellIntensitySelect";
import ColorationSelect from "./ColorationSelect";
export default function WaterwayForm({
  updateFormData,
}: {
  updateFormData: any,
}) {
  return (
    <div>
      <WindSelect updateFormData={updateFormData} />
      <WeatherSelect updateFormData={updateFormData}/>
      <DevelopmentSelect updateFormData={updateFormData}/>
      <SmellIntensitySelect updateFormData={updateFormData}/>
      <ColorationSelect updateFormData={updateFormData}/>
    </div>
  );
}
