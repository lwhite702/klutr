"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { VaultLockScreen } from "@/components/vault/VaultLockScreen";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Input } from "@/components/ui/input";
import { brandColors } from "@klutr/brand";

// Mock encrypted entries
const mockEncryptedEntries = [
  {
    id: "ve1",
    title: "Personal password",
    description: "Encrypted note",
    tags: [{ label: "security" }],
    pinned: false,
  },
  {
    id: "ve2",
    title: "Private journal entry",
    description: "Encrypted note",
    tags: [{ label: "personal" }],
    pinned: true,
  },
  {
    id: "ve3",
    title: "Financial information",
    description: "Encrypted note",
    tags: [{ label: "finance" }],
    pinned: false,
  },
];

export default function VaultPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passphrase, setPassphrase] = useState("");

  const handleUnlock = () => {
    // Placeholder: In real app, this would validate the passphrase
    // For now, any non-empty passphrase unlocks
    if (passphrase.trim()) {
      setIsUnlocked(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
          <PageHeader
            title="Vault"
            description="Encrypted notes that only you can read"
          />
          <div className="flex flex-col items-center gap-4">
            <Input
              type="password"
              placeholder="Enter passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUnlock();
                }
              }}
              className="max-w-md"
            />
            <VaultLockScreen onUnlock={handleUnlock} />
          </div>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Vault"
          description="Your encrypted notes"
        />
        <CardGrid>
          {mockEncryptedEntries.map((entry) => (
            <ItemCard
              key={entry.id}
              title={entry.title}
              description={entry.description}
              tags={entry.tags}
              pinned={entry.pinned}
            />
          ))}
        </CardGrid>
        {mockEncryptedEntries.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2">
              No encrypted notes yet
            </p>
            <p className="text-muted-foreground text-sm">
              Add notes to your vault to keep them encrypted and secure
            </p>
          </div>
        )}
      </div>
  );
}
