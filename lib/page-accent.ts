"use client";

import { useEffect } from "react";

/**
 * Tints the light around the site canvas (see `--page-accent` in globals.css)
 * to match whatever the page is showing, and restores the default on leaving.
 */
export function usePageAccent(color: string) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-accent", color);
    return () => {
      root.style.removeProperty("--page-accent");
    };
  }, [color]);
}
