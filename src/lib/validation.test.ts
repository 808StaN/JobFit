import { describe, expect, it } from "vitest";
import { MAX_CV_FILE_BYTES, validateBullet, validateCvFile, validateJobDescription } from "@/lib/validation";

function makeFile(name: string, type: string, size = 128) {
  return new File(["x".repeat(size)], name, { type });
}

describe("validateCvFile", () => {
  it("asks for a CV when none is provided", () => {
    expect(validateCvFile(null)).toBe("Please upload your CV first.");
  });

  it("rejects non-PDF files", () => {
    expect(validateCvFile(makeFile("notes.txt", "text/plain"))).toBe("Only PDF files are supported.");
  });

  it("rejects files over 5 MB", () => {
    const file = makeFile("cv.pdf", "application/pdf");
    Object.defineProperty(file, "size", { value: MAX_CV_FILE_BYTES + 1 });
    expect(validateCvFile(file)).toBe("Your file is too large. Maximum size: 5 MB.");
  });

  it("accepts a PDF under the size limit", () => {
    expect(validateCvFile(makeFile("Dawid-Stanisz-CV.pdf", "application/pdf"))).toBeNull();
  });
});

describe("validateJobDescription", () => {
  it("rejects an empty job description", () => {
    expect(validateJobDescription("   ")).toBe("Please provide a job description.");
  });

  it("accepts a normal posting", () => {
    expect(validateJobDescription("We need a React developer with TypeScript.")).toBeNull();
  });
});

describe("validateBullet", () => {
  it("rejects an empty bullet", () => {
    expect(validateBullet("")).toBe("Add an existing CV bullet to improve it.");
  });
});
