"use client";

import ChromeEditor from "@/components/admin/chrome-editor";
import LockScreen from "@/components/admin/lock-screen";
import { useAdminAuth } from "@/context/admin-auth-context";

export default function AdminPage() {
  const { authed, loaded } = useAdminAuth();
  if (!loaded) {
    return <div className="min-h-screen bg-[var(--color-paper)]" />;
  }
  if (!authed) return <LockScreen />;
  return <ChromeEditor />;
}
