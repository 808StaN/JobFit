import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CvUpload } from "@/components/analyze/CvUpload";

describe("CvUpload", () => {
  it("lets the user attach a PDF and remove it", async () => {
    const user = userEvent.setup();
    const onFileChange = vi.fn();
    const { rerender } = render(<CvUpload file={null} onFileChange={onFileChange} />);

    const file = new File(["%PDF-1.4 sample"], "Dawid-Stanisz-CV.pdf", { type: "application/pdf" });
    await user.upload(screen.getByLabelText("CV"), file);

    expect(onFileChange).toHaveBeenCalled();
    const uploaded = onFileChange.mock.calls[0][0] as File;
    expect(uploaded.name).toBe("Dawid-Stanisz-CV.pdf");

    rerender(<CvUpload file={file} onFileChange={onFileChange} />);
    expect(screen.getByText("Dawid-Stanisz-CV.pdf")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onFileChange).toHaveBeenLastCalledWith(null);
  });

  it("shows an error for an unsupported file", () => {
    render(<CvUpload file={null} error="Only PDF files are supported." onFileChange={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Only PDF files are supported.");
  });
});
