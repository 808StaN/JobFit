import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/SiteFooter";

describe("SiteFooter", () => {
  it("renders the brand and legal links", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "JobFit" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
    expect(screen.queryByRole("link", { name: "Analyze my fit" })).not.toBeInTheDocument();
  });
});
