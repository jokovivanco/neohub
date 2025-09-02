import { Home } from "@/routes";

import { Button } from "@/components/ui/button";

export default async function EmailVerifiedPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Email verified successfully!
          </h1>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            Your email address has been verified. You can now access all
            features of your account.
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="space-y-4">
        <Home.Link>
          <Button className="w-full">Continue to Dashboard</Button>
        </Home.Link>

        <p className="text-muted-foreground mt-4 text-center text-xs">
          Welcome to NeoHub! Start exploring your new account.
        </p>
      </div>
    </div>
  );
}
