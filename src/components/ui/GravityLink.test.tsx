import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GravityLink } from "@/components/ui/GravityLink";

describe("GravityLink", () => {
  it("renders an accessible link with the supplied destination", () => {
    render(<GravityLink href="/analyze" text="Analyze my fit" icon="arrow-right" />);

    expect(screen.getByRole("link", { name: "Analyze my fit" })).toHaveAttribute("href", "/analyze");
  });
});
