"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { IconButton } from "@/components/ui/icon-button";

/**
 * Light/dark switch. The icon is only rendered after mount: the server cannot
 * know the persisted theme, so rendering it eagerly would produce a hydration
 * mismatch. The button itself is rendered on both passes, so nothing shifts.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <IconButton
      label={isDark ? "Switch to light appearance" : "Switch to dark appearance"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      icon={
        isDark ? (
          <IconMoon aria-hidden="true" size={20} stroke={1.75} />
        ) : (
          <IconSun
            aria-hidden="true"
            size={20}
            stroke={1.75}
            className={mounted ? undefined : "opacity-0"}
          />
        )
      }
    />
  );
}
