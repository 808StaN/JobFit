import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CustomCursor from "@/components/ui/custom-cursor";

function mockFinePointer() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

describe("CustomCursor", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders a blue cursor for fine pointers", () => {
    mockFinePointer();

    const { container } = render(<CustomCursor />);

    expect(container.querySelector("[aria-hidden=true]")).toBeInTheDocument();
  });

  it("tracks links and buttons without wrapper components", () => {
    mockFinePointer();

    const { getByRole } = render(
      <CustomCursor>
        <a href="/analyze">Analyze</a>
        <button type="button">Submit</button>
      </CustomCursor>,
    );

    fireEvent.pointerOver(getByRole("link", { name: "Analyze" }));
    fireEvent.pointerOver(getByRole("button", { name: "Submit" }));

    expect(getByRole("link", { name: "Analyze" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("does not render for coarse pointers", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );

    const { container } = render(<CustomCursor />);

    expect(container.querySelector("[aria-hidden=true]")).not.toBeInTheDocument();
  });
});
