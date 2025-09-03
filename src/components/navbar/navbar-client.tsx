"use client";

import Link from "next/link";
import { useState } from "react";

import { Search, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Session } from "@/lib/auth/auth";
import { cn } from "@/lib/utils";

import { Separator } from "../ui/separator";
import MobileMenuToggle from "./mobile-menu-toggle";
import MobileUserSection from "./mobile-user-section";
import UserMenu from "./user-menu";

interface NavbarClientProps {
  navigationItems: Array<{ name: string; href: string }>;
  session: Session | null;
  onSignOut: () => Promise<void>;
}

export default function NavbarClient({
  navigationItems,
  session,
  onSignOut,
}: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Actions */}
      <div className="hidden items-center space-x-3 md:flex">
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
            3
          </span>
        </Button>

        {/* User Authentication */}
        {session ? (
          <UserMenu user={session.user} onSignOut={onSignOut} />
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <MobileMenuToggle isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "absolute top-16 left-0 w-full md:hidden",
          isMobileMenuOpen
            ? "bg-background/95 block border-t backdrop-blur"
            : "hidden",
        )}
      >
        <div className="flex flex-col items-end space-y-1 px-2 pt-2 pb-3">
          <div className="flex w-full flex-wrap items-center justify-end">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground hover:bg-accent block rounded-md px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Separator className="mt-4" />
          {/* Mobile Actions & Auth */}
          <div
            className={cn(
              "flex gap-4 px-3 py-2",
              session ? "items-start" : "items-center",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-4",
                session ? "mt-3 mr-3" : "",
              )}
            >
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                  3
                </span>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              {/* Mobile User Section */}
              {session ? (
                <MobileUserSection
                  user={session.user}
                  onMenuClose={() => setIsMobileMenuOpen(false)}
                  onSignOut={onSignOut}
                />
              ) : (
                <div className="flex flex-wrap items-center gap-4 py-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      Sign in
                    </Button>
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
