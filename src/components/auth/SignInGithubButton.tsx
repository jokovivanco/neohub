"use client";

import { useFormStatus } from "react-dom";

import { SiGithub } from "@icons-pack/react-simple-icons";

import { Button } from "@/components/ui/button";

interface SignInGithubButtonProps {
  onSubmit: () => Promise<void>;
}

const SignInGithubButton = ({ onSubmit }: SignInGithubButtonProps) => {
  return (
    <form action={onSubmit}>
      <SubmitButton />
    </form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      className="disabled:bg-muted-foreground w-full disabled:pointer-events-none"
      disabled={pending}
    >
      <SiGithub className="mr-2 h-4 w-4" />
      {pending ? "Continue with GitHub..." : "Continue with GitHub"}
    </Button>
  );
};

export default SignInGithubButton;
