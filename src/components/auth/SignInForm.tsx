"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { Home } from "@/routes";
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

import { signInSchema } from "@/lib/auth/schema";
import { type SignInFormData } from "@/lib/auth/zodType";

interface SignInFormProps {
  onSubmit: (
    data: SignInFormData,
  ) => Promise<{ ok: boolean; userId?: string; error?: string } | void>;
}

const SignInForm = ({ onSubmit }: SignInFormProps) => {
  const router = useRouter();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = async (values: SignInFormData) => {
    startTransition(async () => {
      try {
        const response = await onSubmit({
          email: values.email,
          password: values.password,
        });

        if (response?.ok) {
          toast.success("Welcome back!");
          router.push(Home());
        } else {
          toast.error(response?.error);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
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
        <Button
          type="submit"
          className="disabled:bg-muted-foreground w-full disabled:pointer-events-none"
          disabled={isPending}
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
