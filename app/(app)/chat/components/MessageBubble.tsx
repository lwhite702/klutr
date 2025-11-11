"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, File, Link as LinkIcon, Mic } from "lucide-react";
import type { MessageDTO } from "@/lib/dto";

interface MessageBubbleProps {
  message: MessageDTO;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderContent = () => {
    switch (message.type) {
      case "text":
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
      
      case "image":
        return (
          <div className="space-y-2">
            {message.fileUrl && (
              <img
                src={message.fileUrl}
                alt="Uploaded image"
                className="max-w-full h-auto rounded-lg"
              />
            )}
            {message.content && (
              <p className="text-sm text-muted-foreground">{message.content}</p>
            )}
          </div>
        );
      
      case "audio":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-[#FF7F73]" />
              <span className="text-sm">Audio message</span>
            </div>
            {message.transcription && (
              <p className="text-sm text-muted-foreground italic">
                {message.transcription}
              </p>
            )}
            {message.fileUrl && (
              <audio controls src={message.fileUrl} className="w-full" />
            )}
          </div>
        );
      
      case "file":
        return (
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <a
              href={message.fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#FF7F73] hover:underline"
            >
              {message.content || "Download file"}
            </a>
          </div>
        );
      
      case "link":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-[#A7F1D1]" />
              <a
                href={message.fileUrl || message.content || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#FF7F73] hover:underline"
              >
                {message.content || message.fileUrl}
              </a>
            </div>
          </div>
        );
      
      default:
        return <p className="text-sm">{message.content || "Unknown message type"}</p>;
    }
  };

  return (
    <Card className="p-4 mb-4 bg-card">
      <div className="flex items-start justify-between mb-2">
        <Badge variant="outline" className="text-xs">
          {message.type}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatTime(message.createdAt)}
        </span>
      </div>
      {renderContent()}
    </Card>
  );
}

