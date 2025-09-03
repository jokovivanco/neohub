"use client";

import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenuToggle({
  isOpen,
  onToggle,
}: MobileMenuToggleProps) {
  return (
    <div className="relative md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );
}
