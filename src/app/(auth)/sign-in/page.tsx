"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { AuthForgotPassword, AuthSignUp, Home } from "@/routes";
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

import { signIn } from "@/lib/auth/auth-client";
import { signInSchema } from "@/lib/auth/schema";

type SignInFormData = z.infer<typeof signInSchema>;

const Page = () => {
  const router = useRouter();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleFormSubmit = async (values: SignInFormData) => {
    try {
      const { data, error } = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error("Sign in failed", {
          description:
            error.message ?? "Please check your credentials and try again.",
        });
        return;
      }

      if (data) {
        toast.success("Welcome back!");
        router.push(Home());
        router.refresh();
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Sign in failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleSignInWithGithub = async () => {
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
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to access your account
        </p>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignInWithGithub}
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
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
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
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Form>
      </div>

      <div className="space-y-4 text-center text-sm">
        <AuthForgotPassword.Link className="text-primary hover:underline">
          Forgot your password?
        </AuthForgotPassword.Link>

        <div className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <AuthSignUp.Link className="text-primary font-medium hover:underline">
            Sign up
          </AuthSignUp.Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
