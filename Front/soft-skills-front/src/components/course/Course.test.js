import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Course from "./Course";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("axios");

describe("Course Component", () => {
  const mockUseParams = jest.fn().mockReturnValue({ id: "1" });

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: { email: "test@example.com" },
      isAuthenticated: true,
      isLoading: false,
    });
    axios.get.mockImplementation((url) => {
      if (url.includes("/courses/")) {
        return Promise.resolve({
          data: {
            title: "Test Course",
            description: "Test Description",
          },
        });
      } else if (url.includes("/activity/course/")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              title: "Activity 1",
              content_type: "comp",
              path: "/activity/1",
            },
            {
              id: 2,
              title: "Activity 2",
              content_type: "other",
              path: "/activity/2",
            },
          ],
        });
      } else if (url.includes("/answer/")) {
        return Promise.resolve({
          data: [{ activity_id: 1 }],
        });
      }
      return Promise.reject(new Error("not found"));
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
        <Course />
      </Router>
    );
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("renders course details after loading", async () => {
    render(
      <Router>
        <Course />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Course")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
  });

  it("renders activities after loading", async () => {
    render(
      <Router>
        <Course />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Activity 1")).toBeInTheDocument();
      expect(screen.getByText("Activity 2")).toBeInTheDocument();
    });
  });

  it("disables completed activities", async () => {
    render(
      <Router>
        <Course />
      </Router>
    );

    await waitFor(() => {
      const activity1 = screen.getByText("Activity 1").closest("a");
      const activity2 = screen.getByText("Activity 2").closest("a");
      expect(activity1).toHaveAttribute("disabled");
      expect(activity2).not.toHaveAttribute("disabled");
    });
  });

  it("renders the correct video URL based on courseId", async () => {
    render(
      <Router>
        <Course />
      </Router>
    );

    await waitFor(() => {
      const iframe = screen.getByTitle("Course Video");
      expect(iframe).toHaveAttribute(
        "src",
        "https://www.youtube.com/embed/cJUXxjOeoCk"
      );
    });
  });
});
