"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Dashboard content lives on the main homepage after onboarding. */
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted">
      Redirecting…
    </div>
  );
}
