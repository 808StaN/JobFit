import { describe, expect, it } from "vitest";
import { extractCvText } from "@/lib/pdf";

describe("extractCvText", () => {
  it("rejects a non-PDF file before parsing", async () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    await expect(extractCvText(file)).rejects.toThrow("Only PDF files are supported.");
  });

  it("rejects a file that is not a valid PDF signature", async () => {
    const file = new File(["not-a-pdf"], "cv.pdf", { type: "application/pdf" });
    await expect(extractCvText(file)).rejects.toThrow("This file does not appear to be a valid PDF.");
  });
});
