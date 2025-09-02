import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Hero Section - Left Side */}
      <div className="relative hidden overflow-hidden bg-zinc-900 lg:flex lg:flex-1 dark:bg-zinc-50">
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <div className="max-w-xl">
            {/* Logo/Brand */}
            <div className="mb-16">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg dark:bg-zinc-800">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-900" />
              </div>
              <h1 className="mb-4 text-5xl font-bold text-white dark:text-zinc-900">
                NeoHub
              </h1>
              <p className="text-2xl font-light text-zinc-300 dark:text-zinc-600">
                Professional Development Platform
              </p>
            </div>

            {/* Hero Content */}
            <div className="space-y-8">
              <h2 className="text-4xl leading-tight font-semibold text-white dark:text-zinc-900">
                Build with confidence
              </h2>
              <p className="text-xl leading-relaxed font-light text-zinc-200 dark:text-zinc-700">
                Trusted by industry leaders worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="bg-background flex flex-1 items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-800">
              <div className="h-6 w-6 rounded-sm bg-white dark:bg-zinc-100" />
            </div>
            <h1 className="text-foreground text-2xl font-bold">NeoHub</h1>
            <p className="text-muted-foreground">Welcome back</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
