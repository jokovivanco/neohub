"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

import { AuthForgotPassword, AuthSignIn } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { resetPassword } from "@/lib/auth/auth-client";
import { resetPasswordSchema } from "@/lib/auth/schema";
import { type ResetPasswordFormData } from "@/lib/auth/zodType";

function ResetPasswordContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsPending(true);
    const { error } = await resetPassword({
      newPassword: data.password,
      token: token || undefined,
    });
    if (error) {
      toast.error("Password reset failed", {
        description: error.message,
      });
    } else {
      toast.success("Password updated successfully!", {
        description: "You can now sign in with your new password.",
      });
      router.push(AuthSignIn());
    }
    setIsPending(false);
  };

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="space-y-4 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Invalid reset link
            </h1>
            <p className="text-muted-foreground mx-auto max-w-sm text-sm">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <AuthForgotPassword.Link>
            <Button className="w-full">Get new reset link</Button>
          </AuthForgotPassword.Link>

          <div className="text-muted-foreground mt-4 text-center text-sm">
            Remember your password?{" "}
            <AuthSignIn.Link className="text-primary font-medium hover:underline">
              Sign in
            </AuthSignIn.Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your new password below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Updating password..." : "Update password"}
          </Button>
        </form>
      </Form>

      <div className="text-muted-foreground mt-4 text-center text-sm">
        Remember your password?{" "}
        <AuthSignIn.Link className="text-primary font-medium hover:underline">
          Back to sign in
        </AuthSignIn.Link>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
