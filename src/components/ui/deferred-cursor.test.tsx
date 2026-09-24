import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DeferredCursor } from "@/components/ui/deferred-cursor";

vi.mock("@/components/ui/custom-cursor", () => ({
  default: () => <div data-testid="custom-cursor" />,
}));

function mockMedia(coarsePointer = false, reducedMotion = false) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query === "(pointer: coarse)" ? coarsePointer : reducedMotion,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("DeferredCursor", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the existing cursor immediately for fine pointers", async () => {
    mockMedia();

    render(<DeferredCursor />);

    await waitFor(() => expect(screen.getByTestId("custom-cursor")).toBeInTheDocument());
  });

  it("does not load the cursor for coarse pointers", () => {
    mockMedia(true);

    render(<DeferredCursor />);

    expect(screen.queryByTestId("custom-cursor")).not.toBeInTheDocument();
  });
});
