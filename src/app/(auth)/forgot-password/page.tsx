"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthSignIn } from "@/routes";
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

import { forgetPassword } from "@/lib/auth/auth-client";
import { forgotPasswordSchema } from "@/lib/auth/schema";
import { type ForgotPasswordFormData } from "@/lib/auth/zodType";

export default function ForgotPassword() {
  const [isPending, setIsPending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsPending(true);

    const { error } = await forgetPassword({
      email: data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error("Failed to send reset email", {
        description: error.message,
      });
    } else {
      setIsEmailSent(true);
      toast.success("Reset email sent", {
        description: "Check your email for the password reset link.",
      });
    }
    setIsPending(false);
  };

  if (isEmailSent) {
    return (
      <div className="space-y-6">
        <div className="space-y-4 text-center">
          {/* Email Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-10 w-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Check your email
            </h1>
            <p className="text-muted-foreground mx-auto max-w-sm text-sm">
              If an account exists with this email, you&apos;ll receive a
              password reset link shortly.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsEmailSent(false)}
          >
            Try another email
          </Button>

          <div className="text-muted-foreground text-center text-sm">
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
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email address and we&apos;ll send you a reset link
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending..." : "Send reset link"}
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
