"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavMenuButtonProps = {
  open: boolean;
  onToggle: () => void;
  className?: string;
  controlsId?: string;
};

const lineBase =
  "transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] [transform-box:fill-box] [transform-origin:center]";

export function NavMenuButton({
  open,
  onToggle,
  className,
  controlsId = "nav-drawer",
}: NavMenuButtonProps) {
  return (
    <Button
      type="button"
      className={cn("group nav-menu-btn", className)}
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controlsId}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <svg
        className="nav-menu-btn__icon pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* Top line */}
        <path
          d="M4 7h16"
          className={cn(
            lineBase,
            open && "translate-y-[5px] rotate-45"
          )}
        />
        {/* Middle line */}
        <path
          d="M4 12h16"
          className={cn(
            lineBase,
            "ease-[cubic-bezier(.5,.85,.25,1.8)]",
            open && "scale-x-0 opacity-0"
          )}
        />
        {/* Bottom line */}
        <path
          d="M4 17h16"
          className={cn(
            lineBase,
            open && "-translate-y-[5px] -rotate-45"
          )}
        />
      </svg>
    </Button>
  );
}
