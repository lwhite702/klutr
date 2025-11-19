"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { VaultLockScreen } from "@/components/vault/VaultLockScreen";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { apiGet } from "@/lib/clientApi";
import { toast } from "sonner";
import { brandColors } from "@/lib/brand";

interface VaultNote {
  id: string;
  createdAt: string;
}

export default function VaultPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [vaultNotes, setVaultNotes] = useState<VaultNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isUnlocked) {
      loadVaultNotes();
    }
  }, [isUnlocked]);

  const loadVaultNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const notes = await apiGet<VaultNote[]>("/api/vault/list");
      setVaultNotes(notes);
    } catch (err) {
      console.error("[Vault] Load notes error:", err);
      setError("Failed to load vault notes. Please try again.");
      toast.error("Failed to load vault notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = () => {
    // Placeholder: In real app, this would validate the passphrase
    // For now, any non-empty passphrase unlocks
    if (passphrase.trim()) {
      setIsUnlocked(true);
    } else {
      toast.error("Please enter a passphrase");
    }
  };

  if (!isUnlocked) {
    return (
      <AppShell activeRoute="/app/vault">
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
      </AppShell>
    );
  }

  return (
    <AppShell activeRoute="/app/vault">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title="Vault" description="Your encrypted notes" />
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Loading vault notes...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive text-lg mb-2">{error}</p>
            <Button
              onClick={loadVaultNotes}
              variant="outline"
              className="rounded-lg"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <CardGrid>
              {vaultNotes.map((note) => (
                <ItemCard
                  key={note.id}
                  title={`Vault Note ${note.id.slice(0, 8)}`}
                  description={`Created ${new Date(
                    note.createdAt
                  ).toLocaleDateString()}`}
                  tags={[{ label: "encrypted" }]}
                  pinned={false}
                />
              ))}
            </CardGrid>
            {vaultNotes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">
                  No encrypted notes yet
                </p>
                <p className="text-muted-foreground text-sm">
                  Add notes to your vault to keep them encrypted and secure
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
