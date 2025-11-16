/**
 * Audio Transcription using OpenAI Whisper API
 *
 * Downloads audio file from Supabase Storage and transcribes using OpenAI Whisper
 */

import { supabaseAdmin } from "@/lib/supabase";
import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Download file from Supabase Storage
 */
async function downloadFileFromStorage(
  fileUrl: string,
  folder: string = "stream-files"
): Promise<Buffer> {
  // Extract filename from URL
  const urlParts = fileUrl.split("/");
  const fileName = urlParts.slice(-2).join("/"); // Get userId/filename

  // Download file from Supabase Storage
  const { data, error } = await supabaseAdmin.storage
    .from(folder)
    .download(fileName);

  if (error || !data) {
    throw new Error(
      `Failed to download file: ${error?.message || "File not found"}`
    );
  }

  // Convert Blob to Buffer
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Transcribe audio file using OpenAI Whisper API
 *
 * @param fileUrl - URL of the audio file in Supabase Storage
 * @param language - Optional language code (default: "en")
 * @returns Transcribed text
 */
export async function transcribeAudio(
  fileUrl: string,
  language: string = "en"
): Promise<string> {
  try {
    // Download audio file from storage
    const audioBuffer = await downloadFileFromStorage(fileUrl);

    // OpenAI Whisper API accepts File, Blob, or ReadableStream
    // In Node.js, convert Buffer to Uint8Array for Blob/File
    const audioUint8Array = new Uint8Array(audioBuffer);
    const audioBlob = new Blob([audioUint8Array], { type: "audio/webm" });

    // Create a File from Blob for OpenAI API (File extends Blob)
    const audioFile = new File([audioBlob], "audio.webm", {
      type: "audio/webm",
    });

    // Transcribe using OpenAI Whisper
    const transcription = await getOpenAIClient().audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: language,
      response_format: "text",
    });

    // When response_format is "text", OpenAI returns a string directly
    return typeof transcription === "string"
      ? transcription
      : String(transcription);
  } catch (error) {
    console.error("[transcribeAudio] Transcription error:", error);
    throw new Error(
      `Failed to transcribe audio: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
