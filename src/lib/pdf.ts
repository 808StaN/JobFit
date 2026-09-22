import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { MAX_CV_FILE_BYTES } from "@/lib/validation";

export { MAX_CV_FILE_BYTES };
export const MAX_CV_TEXT_LENGTH = 30_000;

export class CvFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CvFileError";
  }
}

export async function extractCvText(file: File) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new CvFileError("Only PDF files are supported.");
  }

  if (file.size === 0) {
    throw new CvFileError("The PDF file is empty.");
  }

  if (file.size > MAX_CV_FILE_BYTES) {
    throw new CvFileError("Your file is too large. Maximum size: 5 MB.");
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const signature = new TextDecoder().decode(data.slice(0, 5));
  if (signature !== "%PDF-") {
    throw new CvFileError("This file does not appear to be a valid PDF.");
  }

  try {
    const parser = new PDFParse({ data });
    const result = await parser.getText();
    await parser.destroy();
    const text = result.text.replace(/\s+/g, " ").trim();

    if (!text) {
      throw new CvFileError("We could not find readable text in this PDF.");
    }

    return text.slice(0, MAX_CV_TEXT_LENGTH);
  } catch (error) {
    if (error instanceof CvFileError) {
      throw error;
    }
    throw new CvFileError("We could not read this PDF. Try a text-based PDF instead.");
  }
}
