import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "portfolio",
    framework: "nextjs",
    env: ".env",
  },
});
