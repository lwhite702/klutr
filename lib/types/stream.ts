// Stream architecture types
export type StreamDropType = "text" | "file" | "image" | "voice";

export interface StreamDrop {
  id: string;
  type: StreamDropType;
  content: string;
  timestamp: Date;
  tags: Array<{ label: string }>;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}
