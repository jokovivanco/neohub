import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Calendar, Mail, Shield, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { auth } from "@/lib/auth/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { user } = session;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>

        <Separator />

        {/* Profile Information */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {user.name?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold">
                    {user.name || "User"}
                  </h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  {user.emailVerified && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Shield className="h-4 w-4" />
                      Verified Account
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>

                {user.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(user.createdAt.toString())}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Email Verification
                  </span>
                  <div
                    className={`text-sm ${user.emailVerified ? "text-green-600" : "text-amber-600"}`}
                  >
                    {user.emailVerified ? "Verified" : "Pending"}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Status</span>
                  <div className="text-sm text-green-600">Active</div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User ID</span>
                  <code className="text-muted-foreground bg-muted rounded px-2 py-1 text-xs">
                    {user.id.slice(0, 8)}...
                  </code>
                </div>
              </div>

              {!user.emailVerified && (
                <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm text-amber-800">
                    Please verify your email address to secure your account.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        {user.updatedAt && (
          <Card>
            <CardHeader>
              <CardTitle>Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Profile last updated on {formatDate(user.updatedAt.toString())}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
