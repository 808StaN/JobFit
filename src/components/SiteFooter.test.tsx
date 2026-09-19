import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/SiteFooter";

describe("SiteFooter", () => {
  it("states that CV files are not stored", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/Files are not stored/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Analyze my fit" })).toHaveAttribute("href", "/analyze");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });
});
