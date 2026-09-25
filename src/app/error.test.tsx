import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";

describe("route error recovery", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("offers retry and home recovery actions", async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    const error = Object.assign(new Error("Route failed"), { digest: "test-digest" });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(<ErrorPage error={error} retry={retry} />);

    expect(screen.getByRole("heading", { name: "We could not load this page." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/");

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
