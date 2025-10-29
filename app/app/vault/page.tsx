"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { VaultLockScreen } from "@/components/vault/VaultLockScreen";
import { VaultList } from "@/components/vault/VaultList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPost } from "@/lib/clientApi";
import { isDemoMode } from "@/lib/onboarding";
import { encryptText } from "@/lib/encryption/secure";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { useAsyncState } from "@/lib/hooks/useAsyncState";
import { Plus, Loader2, AlertCircle } from "lucide-react";

interface VaultNote {
  id: string;
  createdAt: string;
}

export default function VaultPage() {
  const [locked, setLocked] = useState(true);
  const [vaultNotes, setVaultNotes] = useState<VaultNote[]>([]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [password, setPassword] = useState("");
  const demoMode = isDemoMode();

  // Use async state management for better error handling
  const [loadNotesState, loadNotesActions] = useAsyncState<VaultNote[]>([]);
  const [createNoteState, createNoteActions] = useAsyncState<VaultNote | null>(null);

  const handleUnlock = async () => {
    console.log("[v0] Vault unlocked");
    setLocked(false);

    await loadNotesActions.execute(async () => {
      if (demoMode) {
        // Mock vault notes for demo
        const mockNotes = [
          { id: "1", createdAt: new Date().toISOString() },
          { id: "2", createdAt: new Date(Date.now() - 86400000).toISOString() },
        ];
        setVaultNotes(mockNotes);
        return mockNotes;
      }

      // Load vault notes from API
      const data = await apiGet<VaultNote[]>("/api/vault/list");
      setVaultNotes(data);
      return data;
    });
  };

  const handleCreateVaultNote = async () => {
    if (!newNoteContent.trim() || !password) {
      return;
    }

    await createNoteActions.execute(async () => {
      if (demoMode) {
        console.log("[v0] Demo mode: pretend create vault note");
        const newNote = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        setVaultNotes([newNote, ...vaultNotes]);
        setShowNewDialog(false);
        setNewNoteContent("");
        setPassword("");
        return newNote;
      }

      try {
        // Encrypt on client side using secure encryption
        const encryptedBlob = await encryptText(newNoteContent, password);

        // Send to server
        await apiPost("/api/vault/create", { encryptedBlob });

        // Reload vault list
        const data = await apiGet<VaultNote[]>("/api/vault/list");
        setVaultNotes(data);

        // Reset form
        setShowNewDialog(false);
        setNewNoteContent("");
        setPassword("");
        
        return data[0]; // Return the first note as the created one
      } catch (error) {
        console.error("[v0] Failed to create vault note:", error);
        throw error;
      }
    });
  };

  return (
    <ErrorBoundary>
      <AppShell activeRoute="/app/vault">
      <div className="max-w-3xl mx-auto space-y-6">
        {locked ? (
          <VaultLockScreen onUnlock={handleUnlock} />
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Vault</h1>
                <p className="text-muted-foreground">
                  Your most private notes, encrypted and secure.
                </p>
              </div>
              <Button onClick={() => setShowNewDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Vault Note
              </Button>
            </div>

            {loadNotesState.loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-muted rounded" />
                <div className="h-20 bg-muted rounded" />
              </div>
            ) : loadNotesState.error ? (
              <div className="flex items-center gap-2 p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">
                  Failed to load vault notes: {loadNotesState.error}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadNotesActions.execute(async () => {
                    const data = await apiGet<VaultNote[]>("/api/vault/list");
                    setVaultNotes(data);
                    return data;
                  })}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <VaultList notes={vaultNotes} />
            )}

            {/* New Vault Note Dialog */}
            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Vault Note</DialogTitle>
                  <DialogDescription>
                    Your note will be encrypted with your password before
                    leaving your device.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter sensitive information..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Encryption Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Remember this password - you'll need it to decrypt this
                      note later.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewDialog(false)}
                    >
                      Cancel
                    </Button>
                    {/* Error state for note creation */}
                    {createNoteState.error && (
                      <div className="flex items-center gap-2 p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">
                          Failed to create note: {createNoteState.error}
                        </span>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleCreateVaultNote}
                      disabled={
                        !newNoteContent.trim() || 
                        !password || 
                        createNoteState.loading
                      }
                    >
                      {createNoteState.loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Encrypting...
                        </>
                      ) : (
                        "Save Encrypted"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
      </AppShell>
    </ErrorBoundary>
  );
}
