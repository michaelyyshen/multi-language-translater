import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.vercel.multi_language_translater",
  appName: "Multi-Language Translator",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
