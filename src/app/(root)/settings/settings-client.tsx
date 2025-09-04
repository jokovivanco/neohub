"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Home } from "@/routes";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Mail,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  changeEmail,
  changePassword,
  deleteUser,
  sendVerificationEmail,
  updateUser,
} from "@/lib/auth/auth-client";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SettingsClientProps {
  user: User;
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isPendingVerify, startTransitionVerify] = useTransition();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
  });

  const [emailData, setEmailData] = useState({
    newEmail: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateProfile = async () => {
    if (!profileData.name.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await updateUser({
          name: profileData.name.trim(),
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Profile updated successfully");
      } catch (error) {
        console.error("Update profile error:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    });
  };

  const handleChangeEmail = async () => {
    if (!emailData.newEmail) {
      toast.error("Please enter a new email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await changeEmail({
          newEmail: emailData.newEmail,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success(
          "Email change request sent. Please check your new email for verification.",
        );
        setEmailData({ newEmail: "" });
        setShowChangeEmail(false);
      } catch (error) {
        console.error("Change email error:", error);
        toast.error("Failed to send email change request. Please try again.");
      }
    });
  };

  const handleChangePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          revokeOtherSessions: true,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowChangePassword(false);
      } catch (error) {
        console.error("Change password error:", error);
        toast.error(
          "Failed to update password. Please check your current password and try again.",
        );
      }
    });
  };

  const handleSendVerification = async () => {
    startTransitionVerify(async () => {
      try {
        const { error } = await sendVerificationEmail({
          email: user.email!,
          callbackURL: `${window.location.origin}/email-verified`,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Verification email sent! Please check your inbox.");
      } catch (error) {
        console.error("Send verification error:", error);
        toast.error("Failed to send verification email. Please try again.");
      }
    });
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      startTransition(async () => {
        try {
          const { error } = await deleteUser();
          if (error) {
            toast.error(error.message);
            return;
          }
          toast.success("Account has been deleted successfully");
          router.push(Home());
          router.refresh();
        } catch (error) {
          console.error("Delete account error:", error);
          toast.error("Failed to delete account. Please try again.");
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || "User"}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {user.name?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your display name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  value={profileData.email}
                  disabled
                  className="bg-muted"
                />
                <div className="absolute top-1/2 right-2 -translate-y-1/2 transform">
                  {user.emailVerified ? (
                    <div className="flex items-center text-xs text-green-600">
                      <Shield className="mr-1 h-3 w-3" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-orange-600">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Not Verified
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button
              onClick={handleUpdateProfile}
              disabled={isPending}
              className="flex-1 sm:flex-none"
            >
              {isPending ? "Updating..." : "Update Profile"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowChangeEmail(!showChangeEmail)}
              className="flex-1 sm:flex-none"
            >
              <Mail className="mr-2 h-4 w-4" />
              Change Email
            </Button>
            {!user.emailVerified && (
              <Button
                variant="outline"
                onClick={handleSendVerification}
                disabled={isPendingVerify}
                className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50 sm:flex-none"
              >
                <Shield className="mr-2 h-4 w-4" />
                {isPendingVerify ? "Sending Verification..." : "Verify Email"}
              </Button>
            )}
          </div>

          {showChangeEmail && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      You will need to verify your new email address before the
                      change takes effect.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="newEmail">New Email Address</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      value={emailData.newEmail}
                      onChange={(e) =>
                        setEmailData((prev) => ({
                          ...prev,
                          newEmail: e.target.value,
                        }))
                      }
                      placeholder="Enter new email address"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleChangeEmail}
                      disabled={isPending}
                      size="sm"
                    >
                      Send Verification
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowChangeEmail(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="flex-1 sm:flex-none"
            >
              Change Password
            </Button>
          </div>

          {showChangePassword && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-full px-3"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleChangePassword}
                      disabled={isPending}
                      size="sm"
                    >
                      Update Password
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowChangePassword(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Account Created
              </h4>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-destructive/50 [&>svg+div]:translate-y-[1px]!">
            <Trash2 className="h-4 w-4" />
            <AlertDescription>
              Once you delete your account, there is no going back. Please be
              certain.
            </AlertDescription>
          </Alert>

          <div className="mt-4">
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
