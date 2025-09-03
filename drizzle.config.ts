import env from "@/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
