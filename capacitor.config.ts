import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.reedu.aican",
  appName: "AI.CAN",
  webDir: "out",
  android: {
    useLegacyBridge: true,
  },
  // plugins: {
  //   CapacitorHttp: {
  //     enabled: true,
  //   },
  // },
};
export default config;
