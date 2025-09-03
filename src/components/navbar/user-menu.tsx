"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Home } from "@/routes";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onSignOut: () => Promise<
    | {
        ok: boolean;
        error?: undefined;
      }
    | {
        ok: boolean;
        error: string;
      }
  >;
}

export default function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = async () => {
    startTransition(async () => {
      try {
        const response = await onSignOut();

        if (response?.ok) {
          toast.success("You have safely logged out");
          router.push(Home());
          router.refresh();
        } else {
          toast.error(response?.error);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar className="h-8 w-8">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium">{user.name || "User"}</span>
          <span className="text-muted-foreground text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <UserCircle className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 disabled:pointer-events-none disabled:text-red-800"
          onClick={handleSignOut}
          disabled={isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
