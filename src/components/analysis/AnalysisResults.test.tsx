import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { sampleAnalysis } from "@/test/fixtures/analysis";

describe("AnalysisResults", () => {
  it("renders the match score and recommendations", () => {
    render(<AnalysisResults analysis={sampleAnalysis} />);

    expect(screen.getByText("79%")).toBeInTheDocument();
    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
    expect(screen.getByText("Missing from CV")).toBeInTheDocument();
    expect(screen.getByText("Add testing experience")).toBeInTheDocument();
    expect(screen.getByText("Describe any testing work you have already done.")).toBeInTheDocument();
  });

  it("renders explicit empty states for defensive client-side handling", () => {
    render(
      <AnalysisResults
        analysis={{ ...sampleAnalysis, jobRequirements: [], experienceRelevance: [] }}
      />,
    );

    expect(screen.getByText("No job requirements were returned for this analysis.")).toBeInTheDocument();
    expect(screen.getByText("No relevant experience was identified for this role.")).toBeInTheDocument();
  });
});
