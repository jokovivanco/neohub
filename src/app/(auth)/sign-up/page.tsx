"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthSignIn, Home } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { toast } from "sonner";
import type { z } from "zod";

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
import { Separator } from "@/components/ui/separator";

import { signIn, signUp } from "@/lib/auth/auth-client";
import { signUpSchema } from "@/lib/auth/schema";

export default function SignUp() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          toast.success("Account created successfully!", {
            description: "Please check your email to verify your account.",
          });

          router.push(Home());
          router.refresh();
        },
        onError: (ctx) => {
          toast.error("Sign up failed", {
            description: ctx.error.message ?? "Please try again later.",
          });
        },
      },
    );
    setPending(false);
  };

  const handleSignUpWithGithub = async () => {
    await signIn.social(
      {
        provider: "github",
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: async () => {
          router.push(Home());
          router.refresh();
        },
        onError: (ctx) => {
          toast.error("GitHub sign up failed", {
            description:
              ctx.error.message ??
              "Something went wrong with GitHub authentication.",
          });
        },
      },
    );
    setPending(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your details to get started
        </p>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignUpWithGithub}
          disabled={pending}
        >
          <SiGithub className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with email
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Confirm password</FormLabel>
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
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <AuthSignIn.Link className="text-primary font-medium hover:underline">
          Sign in
        </AuthSignIn.Link>
      </div>
    </div>
  );
}
