import { AuthSignIn } from "@/routes";

import SignInGithubButton from "@/components/auth/SignInGithubButton";
import SignUpForm from "@/components/auth/SignUpForm";
import { Separator } from "@/components/ui/separator";

import { signInGitHub, signUp } from "@/lib/auth/actions";

const Page = () => {
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

        <SignUpForm onSubmit={signUp} />
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
