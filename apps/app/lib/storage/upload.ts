/**
 * File Upload Utilities
 *
 * Handles file uploads to Supabase Storage with validation and optimization
 */

import { supabaseAdmin } from "@/lib/supabase";

export interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileType: string;
  size: number;
}

export interface UploadOptions {
  maxSize?: number; // in bytes, default 10MB
  allowedTypes?: string[];
  folder?: string;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "audio/mpeg",
  "audio/wav",
  "audio/webm",
];

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  userId: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    maxSize = DEFAULT_MAX_SIZE,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    folder = "stream-files",
  } = options;

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
  }

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const fileName = `${userId}/${timestamp}-${random}.${fileExt}`;

  // Convert File to Buffer for Supabase
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from(folder)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[storage] Upload error:", uploadError);
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(folder)
    .getPublicUrl(fileName);

  return {
    fileUrl: urlData.publicUrl,
    fileName: file.name,
    fileType: file.type,
    size: file.size,
  };
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  fileUrl: string,
  folder: string = "stream-files"
): Promise<void> {
  // Extract filename from URL
  const urlParts = fileUrl.split("/");
  const fileName = urlParts.slice(-2).join("/"); // Get userId/filename

  const { error } = await supabaseAdmin.storage
    .from(folder)
    .remove([fileName]);

  if (error) {
    console.error("[storage] Delete error:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

