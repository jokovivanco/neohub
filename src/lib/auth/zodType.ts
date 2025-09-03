import type { z } from "zod";

import { type signInSchema } from "@/lib/auth/schema";

export type SignInFormData = z.infer<typeof signInSchema>;
