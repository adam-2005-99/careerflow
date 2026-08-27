import { test, expect, vi, afterEach } from "vitest";
import { cleanup, cleenup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "./Login";


afterEach(() => {
    cleanup()
    vi.restoreAllMocks();
});


test("renders the login form", () => {
    render(
    <MemoryRouter>
        <Login />
    </MemoryRouter>
    );

    expect(
        screen.getByRole("heading", { name: /login/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    expect(
        screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
});


test("shows an error when login credentials are invalid", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: false,
    json: async () => ({
        detail: "Invalid email or password",
    }),
    });

    render(
    <MemoryRouter>
        <Login />
    </MemoryRouter>
    );

    await user.type(
        screen.getByLabelText("Email"),
        "test@example.com"
    );

    await user.type(
        screen.getByLabelText("Password"),
        "wrongpassword"
    );

    
    await user.click(
        screen.getByRole("button", { name: /login/i })
    );

    expect(
        await screen.findByText("Invalid email or password")
    ).toBeInTheDocument();
});