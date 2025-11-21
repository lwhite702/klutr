"use client";

import { useState, useRef, KeyboardEvent, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";
import { brandColors } from "@/lib/brand";

interface StreamInputProps {
  onSend: (content: string) => void;
  onFileUpload?: (files: File[]) => void;
  placeholder?: string;
}

export const StreamInput = forwardRef<HTMLTextAreaElement, StreamInputProps>(({
  onSend,
  onFileUpload,
  placeholder = "Type your thoughts...",
}, ref) => {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
      setIsExpanded(false);
      if (internalRef.current) {
        internalRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onFileUpload) {
      onFileUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!input) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={internalRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="min-h-[44px] max-h-[200px] resize-none pr-20 rounded-lg border-border font-body"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,application/pdf,.doc,.docx"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload file"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={!input.trim()}
          className="h-[44px] px-4 bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white rounded-lg shadow-sm"
          style={{ backgroundColor: brandColors.coral }}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {isExpanded && (
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      )}
    </div>
  );
});

StreamInput.displayName = "StreamInput";

