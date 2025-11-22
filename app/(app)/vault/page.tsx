"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";

export default function VaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/stream");
  }, [router]);

  return (
    <AppShell activeRoute="/app/stream">
      <div className="max-w-3xl mx-auto py-16 space-y-4 text-center">
        <PageHeader
          title="Vault is paused for Beta"
          description="We’re focused on Stream and automatic organization. Vault will return after the security review."
        />
        <div className="space-y-3 text-muted-foreground">
          <p>
            To keep you moving, we’ve routed Vault traffic back to your Stream inbox.
            You can still capture sensitive notes, but they’ll stay in your main workspace for now.
          </p>
          <p className="text-sm">
            Looking for secure storage? Reach out to support so we can prioritize your use case.
          </p>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => router.push("/app/stream")}>Go to Stream</Button>
        </div>
      </div>
    </AppShell>
  );
}
