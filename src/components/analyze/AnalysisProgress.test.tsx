import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalysisProgress } from "@/components/analyze/AnalysisProgress";

describe("AnalysisProgress", () => {
  it("announces the loading state to assistive tech", () => {
    render(<AnalysisProgress />);
    expect(screen.getByRole("status")).toHaveTextContent("Analyzing your CV");
    expect(screen.getByRole("status")).toHaveTextContent("reading both documents");
  });

  it("explains that the previous result remains visible", () => {
    render(<AnalysisProgress hasPreviousResult />);
    expect(screen.getByRole("status")).toHaveTextContent("current review stays visible");
  });
});
