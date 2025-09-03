"use client";

import { LogOut, Settings, UserCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileUserSectionProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onMenuClose: () => void;
  onSignOut: () => Promise<void>;
}

export default function MobileUserSection({
  user,
  onMenuClose,
  onSignOut,
}: MobileUserSectionProps) {
  const handleSignOut = async () => {
    await onSignOut();
    onMenuClose();
  };

  return (
    <div>
      <div className="flex items-center space-x-3 py-2">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user.image || undefined}
            alt={user.name || "User"}
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user.name?.charAt(0).toUpperCase() ||
              user.email?.charAt(0).toUpperCase() ||
              "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-medium">
            {user.name || "User"}
          </p>
          <p className="text-muted-foreground truncate text-xs">{user.email}</p>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <button className="text-foreground/80 hover:bg-accent hover:text-foreground flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors">
          <UserCircle className="mr-3 h-4 w-4" />
          Profile
        </button>
        <button className="text-foreground/80 hover:bg-accent hover:text-foreground flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors">
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </button>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
