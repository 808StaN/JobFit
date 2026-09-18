import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { JobDescriptionField } from "@/components/analyze/JobDescriptionField";

describe("JobDescriptionField", () => {
  it("updates the character count as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<JobDescriptionField value="" onChange={onChange} />);

    await user.type(screen.getByLabelText("Job description"), "React");
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByText(/0 of 20,000 characters/)).toBeInTheDocument();
  });

  it("shows a validation error for an empty description", () => {
    render(
      <JobDescriptionField value="" error="Please provide a job description." onChange={vi.fn()} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Please provide a job description.");
  });
});
