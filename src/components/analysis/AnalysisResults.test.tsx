import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { sampleAnalysis } from "@/test/fixtures/analysis";

describe("AnalysisResults", () => {
  it("renders the match score and recommendations", () => {
    render(<AnalysisResults analysis={sampleAnalysis} />);

    expect(screen.getByText("78%")).toBeInTheDocument();
    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
    expect(screen.getByText("Missing from CV")).toBeInTheDocument();
    expect(screen.getByText("Add testing experience")).toBeInTheDocument();
    expect(screen.getByText("Describe any testing work you have already done.")).toBeInTheDocument();
  });
});
