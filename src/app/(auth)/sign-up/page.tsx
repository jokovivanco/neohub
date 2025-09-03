"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { AuthSignIn, Home } from "@/routes";
import type { ErrorContext } from "@better-fetch/fetch";
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

type SignUpFormData = z.infer<typeof signUpSchema>;

const Page = () => {
  const router = useRouter();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const [isPending, startTransition] = useTransition();
  const [isPendingGithub, startTransitionGithub] = useTransition();

  const handleFormSubmit = async (values: SignUpFormData) => {
    startTransition(async () => {
      try {
        const { data, error } = await signUp.email({
          name: values.name,
          email: values.email,
          password: values.password,
        });

        if (error) {
          toast.error("Sign up failed", {
            description:
              error.message ?? "Please check your information and try again.",
          });
          return;
        }

        if (data) {
          toast.success("Account created successfully!");
          router.push(Home());
          router.refresh();
        }
      } catch (error) {
        console.error("Sign up error:", error);
        toast.error("Sign up failed", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  const handleSignInWithGithub = async () => {
    startTransitionGithub(async () => {
      await signIn.social(
        { provider: "github" },
        {
          onSuccess: async () => {
            router.push(Home());
            router.refresh();
          },
          onError: (ctx: ErrorContext) => {
            toast.error("GitHub sign in failed", {
              description:
                ctx.error.message ??
                "Something went wrong with GitHub authentication.",
            });
          },
        },
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your information to create a new account
        </p>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="disabled:bg-muted w-full disabled:pointer-events-none"
          onClick={handleSignInWithGithub}
          disabled={isPendingGithub}
        >
          <SiGithub className="mr-2 h-4 w-4" />
          {isPendingGithub ? "Continue with GitHub..." : "Continue with GitHub"}
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
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
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
                      placeholder="Enter your password"
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
                  <FormLabel>Confirm Password</FormLabel>
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
            <Button
              type="submit"
              className="disabled:bg-muted-foreground w-full disabled:pointer-events-none"
              disabled={isPending}
            >
              {isPending ? "Signing up..." : "Sign up"}
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
};

export default Page;
