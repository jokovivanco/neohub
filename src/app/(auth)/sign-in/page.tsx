import { AuthForgotPassword, AuthSignUp } from "@/routes";

import SignInForm from "@/components/auth/SignInForm";
import SignInGithubButton from "@/components/auth/SignInGithubButton";
import { Separator } from "@/components/ui/separator";

import { signIn, signInGitHub } from "@/lib/auth/actions";

const Page = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to access your account
        </p>
      </div>

      <div className="space-y-4">
        <SignInGithubButton onSubmit={signInGitHub} />

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

        <SignInForm onSubmit={signIn} />
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
