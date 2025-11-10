"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Mic, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface DropComposerProps {
  onSend: (type: "text" | "audio" | "image" | "file" | "link", content?: string, fileUrl?: string, url?: string) => void;
}

export function DropComposer({ onSend }: DropComposerProps) {
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Check if content is a URL
    const urlPattern = /^https?:\/\/.+/;
    if (urlPattern.test(content.trim())) {
      onSend("link", undefined, undefined, content.trim());
    } else {
      onSend("text", content.trim());
    }
    setContent("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload file to Supabase Storage
    // For now, show placeholder
    toast.info("File upload coming soon");
    
    // Determine file type
    if (file.type.startsWith("image/")) {
      // onSend("image", undefined, fileUrl);
    } else if (file.type.startsWith("audio/")) {
      // onSend("audio", undefined, fileUrl);
    } else {
      // onSend("file", undefined, fileUrl);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVoiceRecord = () => {
    // TODO: Implement voice recording
    toast.info("Voice recording coming soon");
    setIsRecording(true);
    // Simulate recording stop after 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      // onSend("audio", undefined, audioFileUrl);
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message or paste a link..."
          className="min-h-[60px] pr-20 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="absolute right-2 bottom-2 flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleVoiceRecord}
            disabled={isRecording}
            title="Record voice"
          >
            <Mic className={`h-4 w-4 ${isRecording ? "text-[#FF7F73]" : ""}`} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="AI insights"
          >
            <Lightbulb className="h-4 w-4 text-[#A7F1D1]" />
          </Button>
        </div>
      </div>
      <Button type="submit" disabled={!content.trim()}>
        Send
      </Button>
    </form>
  );
}

