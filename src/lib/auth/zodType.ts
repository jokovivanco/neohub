import type { z } from "zod";

import { type signInSchema, type signUpSchema } from "@/lib/auth/schema";

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
