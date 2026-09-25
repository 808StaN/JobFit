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

  it("keeps the complete form flow keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<AnalyzeWorkspace />);

    const cvInput = screen.getByLabelText("CV");
    const uploadButton = screen.getByRole("button", { name: /Drop your PDF here/ });
    const jobDescription = screen.getByLabelText("Job description");
    const submitButton = screen.getByRole("button", { name: "Analyze my fit" });

    await user.tab();
    expect(cvInput).toHaveFocus();
    await user.tab();
    expect(uploadButton).toHaveFocus();
    await user.tab();
    expect(jobDescription).toHaveFocus();
    await user.tab();
    expect(submitButton).toHaveFocus();

    await user.keyboard("{Enter}");
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
    expect(await screen.findByText("79%")).toBeInTheDocument();
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

  it("keeps the current report visible while a replacement is running", async () => {
    const user = userEvent.setup();
    let finishSecondRequest: (() => void) | undefined;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ analysis: sampleAnalysis }),
      })
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finishSecondRequest = () => resolve({ ok: true, json: async () => ({ analysis: sampleAnalysis }) });
          }),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<AnalyzeWorkspace />);
    await user.upload(screen.getByLabelText("CV"), new File(["%PDF-1.4"], "cv.pdf", { type: "application/pdf" }));
    await user.type(screen.getByLabelText("Job description"), "React engineer using TypeScript");
    await user.click(screen.getByRole("button", { name: "Analyze my fit" }));

    expect(await screen.findByText("79%")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Run a new review" }));

    expect(await screen.findByRole("status")).toHaveTextContent("current review stays visible");
    expect(screen.getByText("79%")).toBeInTheDocument();

    finishSecondRequest?.();
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
  });
});
