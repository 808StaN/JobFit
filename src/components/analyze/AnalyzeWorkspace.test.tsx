import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalyzeWorkspace } from "@/components/analyze/AnalyzeWorkspace";
import { sampleAnalysis } from "@/test/fixtures/analysis";

describe("AnalyzeWorkspace", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("blocks submit when the CV and job description are missing", async () => {
    const user = userEvent.setup();
    render(<AnalyzeWorkspace />);

    await user.click(screen.getByRole("button", { name: "Analyze my fit" }));

    expect(screen.getByText("Please upload your CV first.")).toBeInTheDocument();
    expect(screen.getByText("Please provide a job description.")).toBeInTheDocument();
  });

  it("shows the loading state and then the analysis", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 80));
        return {
          ok: true,
          json: async () => ({ analysis: sampleAnalysis }),
        };
      }),
    );

    render(<AnalyzeWorkspace />);
    const file = new File(["%PDF-1.4 sample"], "cv.pdf", { type: "application/pdf" });
    await user.upload(screen.getByLabelText("CV"), file);
    await user.type(screen.getByLabelText("Job description"), "Frontend engineer using React and TypeScript.");
    await user.click(screen.getByRole("button", { name: "Analyze my fit" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Analyzing your CV");
    expect(await screen.findByText("78%")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Improve a CV bullet" })).toBeInTheDocument();
  });

  it("shows a fallback when the API fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "We could not analyze your CV right now. Please try again." }),
      }),
    );

    render(<AnalyzeWorkspace />);
    await user.upload(screen.getByLabelText("CV"), new File(["%PDF-1.4"], "cv.pdf", { type: "application/pdf" }));
    await user.type(screen.getByLabelText("Job description"), "React role");
    await user.click(screen.getByRole("button", { name: "Analyze my fit" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("We could not analyze your CV right now.");
    });
  });
});
