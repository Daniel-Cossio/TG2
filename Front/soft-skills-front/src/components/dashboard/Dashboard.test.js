import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Album from "./Dashboard";

jest.mock("axios");
jest.mock("@auth0/auth0-react");

describe("Dashboard Component", () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: { email: "test@example.com" },
      isAuthenticated: true,
      isLoading: false,
    });
    axios.get.mockResolvedValue({
      data: [
        { id: 1, title: "Course 1", image: "https://imgur.com/course1.jpg" },
        { id: 2, title: "Course 2", image: "https://imgur.com/course2.jpg" },
      ],
    });
  });

  it("renders loading state initially", () => {
    useAuth0.mockReturnValueOnce({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
    render(
      <Router>
        <Album />
      </Router>
    );
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("redirects to home if not authenticated", () => {
    useAuth0.mockReturnValueOnce({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    render(
      <Router>
        <Album />
      </Router>
    );
    expect(screen.getByText("Cargando...")).not.toBeInTheDocument();
  });

  it("renders courses after loading", async () => {
    render(
      <Router>
        <Album />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Course 1")).toBeInTheDocument();
      expect(screen.getByText("Course 2")).toBeInTheDocument();
    });
  });

  it("displays course details correctly", async () => {
    render(
      <Router>
        <Album />
      </Router>
    );

    await waitFor(() => {
      const course1 = screen.getByText("Course 1").closest("div");
      const course2 = screen.getByText("Course 2").closest("div");
      expect(course1).toHaveTextContent("Course 1");
      expect(course1).toHaveTextContent("1");
      expect(course2).toHaveTextContent("Course 2");
      expect(course2).toHaveTextContent("2");
    });
  });

  it("renders default image if no image is provided", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, title: "Course 1" }],
    });

    render(
      <Router>
        <Album />
      </Router>
    );

    await waitFor(() => {
      const courseImage = screen.getByRole("img");
      expect(courseImage).toHaveAttribute(
        "src",
        "https://imgur.com/swGMaxA.jpg"
      );
    });
  });
});
