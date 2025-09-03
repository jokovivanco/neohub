import type { z } from "zod";

import {
  type forgotPasswordSchema,
  type resetPasswordSchema,
  type signInSchema,
  type signUpSchema,
} from "@/lib/auth/schema";

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
