import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalysisProgress } from "@/components/analyze/AnalysisProgress";

describe("AnalysisProgress", () => {
  it("announces the loading state to assistive tech", () => {
    render(<AnalysisProgress activeStep={2} />);
    expect(screen.getByRole("status")).toHaveTextContent("Analyzing your CV");
    expect(screen.getByText(/Comparing skills, in progress/)).toBeInTheDocument();
  });
});
