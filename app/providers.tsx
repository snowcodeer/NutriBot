"use client";

import { MobileAppShell } from "./components/MobileAppShell";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MobileAppShell>{children}</MobileAppShell>;
}
