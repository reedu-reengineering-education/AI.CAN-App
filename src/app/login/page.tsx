import Wrapper from "@/components/Wrapper/Wrapper";
import LoginAndSelectBox from "@/components/openSenseMap/LoginAndSelectBox";
import LoginOrRegister from "@/components/openSenseMap/LoginOrRegister";

export default function Home() {
  return (
    <div className="flex h-[100vh] p-4 items-center">
      <LoginAndSelectBox />
    </div>
  );
}
