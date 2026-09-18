import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorMessage } from "@/components/analyze/ErrorMessage";

describe("ErrorMessage", () => {
  it("exposes the message as an alert", () => {
    render(<ErrorMessage>We could not analyze your CV right now.</ErrorMessage>);
    expect(screen.getByRole("alert")).toHaveTextContent("We could not analyze your CV right now.");
  });
});
