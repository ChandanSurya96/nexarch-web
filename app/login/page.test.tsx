import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";

const { login, push } = vi.hoisted(() => ({
  login: vi.fn(),
  push: vi.fn(),
}));

vi.mock("@/lib/auth/AuthProvider", () => ({
  useAuth: () => ({ login }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

import LoginPage from "@/app/login/page";

describe("LoginPage", () => {
  beforeEach(() => {
    login.mockReset();
    push.mockReset();
  });

  it("submits the entered credentials and redirects home on success", async () => {
    login.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<LoginPage />);
    await user.type(screen.getByLabelText(/email/i), "rohan@example.com");
    await user.type(screen.getByLabelText(/password/i), "hunter2");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith("rohan@example.com", "hunter2"));
    expect(push).toHaveBeenCalledWith("/");
  });

  it("shows the backend's error message and does not redirect when login fails", async () => {
    login.mockRejectedValue(new ApiError("INVALID_CREDENTIALS", "Invalid email or password.", 401));
    const user = userEvent.setup();

    render(<LoginPage />);
    await user.type(screen.getByLabelText(/email/i), "rohan@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("requires both email and password before the browser allows submission", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();
  });
});
