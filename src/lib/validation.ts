export const MAX_CV_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_JOB_DESCRIPTION_LENGTH = 20_000;
export const MAX_BULLET_LENGTH = 1_000;

export function validateCvFile(file: File | null) {
  if (!file) {
    return "Please upload your CV first.";
  }

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return "Only PDF files are supported.";
  }

  if (file.size === 0) {
    return "The PDF file is empty.";
  }

  if (file.size > MAX_CV_FILE_BYTES) {
    return "Your file is too large. Maximum size: 5 MB.";
  }

  return null;
}

export function validateJobDescription(value: string) {
  if (!value.trim()) {
    return "Please provide a job description.";
  }

  if (value.length > MAX_JOB_DESCRIPTION_LENGTH) {
    return "The job description is too long. Maximum size: 20,000 characters.";
  }

  return null;
}

export function validateBullet(value: string) {
  if (!value.trim()) {
    return "Add an existing CV bullet to improve it.";
  }

  if (value.trim().length > MAX_BULLET_LENGTH) {
    return "That bullet is too long. Keep it under 1,000 characters.";
  }

  return null;
}
