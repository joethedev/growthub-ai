"use server";

import OpenAI from "openai";
import { toFile } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type TranscribeResult =
  | { success: true; text: string }
  | { success: false; error: string };

export async function transcribeAudio(
  formData: FormData,
): Promise<TranscribeResult> {
  try {
    const file = formData.get("audio");
    if (!(file instanceof Blob)) {
      return { success: false, error: "No audio provided." };
    }

    const audioFile = await toFile(file, "recording.webm", {
      type: file.type || "audio/webm",
    });

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "ar", // Arabic covers Darija best; Whisper auto-detects dialect
      response_format: "verbose_json",
    });

    const text = response.text?.trim();
    if (!text)
      return {
        success: false,
        error: "Whisper returned an empty transcription.",
      };

    return { success: true, text };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
