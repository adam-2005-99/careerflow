import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectRoute";

const localStorageMock = {
  getItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("redirects to login when user is not authenticated", () => {
  localStorageMock.getItem.mockReturnValue(null);

  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <h1>Dashboard</h1>
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<h1>Login Page</h1>}
        />
      </Routes>
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: "Login Page" })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole("heading", { name: "Dashboard" })
  ).not.toBeInTheDocument();
});