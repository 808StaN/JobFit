import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/SiteHeader";

describe("SiteHeader", () => {
  it("keeps a single analysis call to action", () => {
    render(<SiteHeader />);
    expect(screen.getAllByRole("link", { name: "Analyze my fit" })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });
});
