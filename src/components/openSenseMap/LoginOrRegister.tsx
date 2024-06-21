import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import OpenSenseMapLogin from "./OpenSenseMapLogin";
import OpenSenseMapRegister from "./OpenSenseMapRegister";

export default function LoginOrRegister({
  setAlreadyLoggedIn,
}: {
  setAlreadyLoggedIn?: (value: boolean) => void;
}) {
  return (
    <Tabs className="w-full" defaultValue="login">
      <TabsList className="flex justify-evenly w-full ">
        <TabsTrigger value="login">Login</TabsTrigger>
        {/* <TabsTrigger value="register">Registrieren</TabsTrigger> */}
      </TabsList>
      <TabsContent value="login">
        <OpenSenseMapLogin setAlreadyLoggedIn={setAlreadyLoggedIn} />
      </TabsContent>
      {/* <TabsContent value="register">
        <OpenSenseMapRegister />
      </TabsContent> */}
    </Tabs>
  );
}
