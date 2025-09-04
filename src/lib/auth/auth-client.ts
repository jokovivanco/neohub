import env from "@/env";
import { createAuthClient } from "better-auth/react";

export const {
  forgetPassword,
  resetPassword,
  sendVerificationEmail,
  updateUser,
  changeEmail,
  changePassword,
  deleteUser,
} = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
