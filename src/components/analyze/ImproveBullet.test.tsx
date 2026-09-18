import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImproveBullet } from "@/components/analyze/ImproveBullet";

describe("ImproveBullet", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asks for an existing bullet before calling the API", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<ImproveBullet jobDescription="React engineer" />);
    await user.click(screen.getByRole("button", { name: "Improve" }));

    expect(screen.getByText("Add an existing CV bullet to improve it.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the rewritten bullet and copies it", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          improvedBullet: "Built accessible React interfaces with TypeScript and reusable components.",
          rationale: "The rewrite keeps the original stack and adds role-relevant clarity.",
        }),
      }),
    );

    render(<ImproveBullet jobDescription="React engineer" />);
    await user.type(screen.getByLabelText("Existing bullet"), "Built a website using React and TypeScript.");
    await user.click(screen.getByRole("button", { name: "Improve" }));

    expect(await screen.findByText(/Built accessible React interfaces/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });
});
