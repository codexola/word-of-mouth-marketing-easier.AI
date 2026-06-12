"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";

export default function Home() {
  const router = useRouter();
  const { authLoading, isAuthenticated } = useApp();

  useEffect(() => {
    if (authLoading) return;
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [authLoading, isAuthenticated, router]);

  return (
    <div className="flex h-screen items-center justify-center text-muted-foreground">
      ...
    </div>
  );
}
