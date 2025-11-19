"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { DataSection } from "@/components/settings/DataSection";

export default function SettingsPage() {
  return (
    <AppShell activeRoute="/app/settings">
      <div className="max-w-4xl mx-auto space-y-8">
        <PageHeader
          title="Settings"
          description="Manage your account, preferences, and data"
        />
        
        <div className="space-y-6">
          <ProfileSection />
          <PreferencesSection />
          <PrivacySection />
          <DataSection />
      </div>
      </div>
    </AppShell>
  );
}

