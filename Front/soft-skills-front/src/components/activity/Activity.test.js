import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Activity from "./Activity.js";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("axios");

describe("Activity Component", () => {
  const mockNavigate = jest.fn();
  const mockUseParams = jest.fn().mockReturnValue({ id: "1" });

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: { email: "test@example.com" },
      isAuthenticated: true,
      isLoading: false,
    });
    axios.get.mockResolvedValue({
      data: {
        title: "Test Activity",
        objective: "Test Objective",
        metodology: "Test Metodology",
        resources: "Test Resources",
        introduction: "Test Introduction",
        analisis: "Test Analisis",
        evaluation: "Test Evaluation",
        example: "<p>Example Content</p>",
        question1: "Question 1?",
        question2: "Question 2?",
        question3: "Question 3?",
        question4: "Question 4?",
        question5: "Question 5?",
      },
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
        <Activity />
      </Router>
    );
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("renders activity details after loading", async () => {
    render(
      <Router>
        <Activity />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Activity")).toBeInTheDocument();
      expect(screen.getByText("Test Objective")).toBeInTheDocument();
      expect(screen.getByText("Test Metodology")).toBeInTheDocument();
      expect(screen.getByText("Test Resources")).toBeInTheDocument();
      expect(screen.getByText("Test Introduction")).toBeInTheDocument();
      expect(screen.getByText("Test Analisis")).toBeInTheDocument();
      expect(screen.getByText("Test Evaluation")).toBeInTheDocument();
      expect(screen.getByText("Actividad")).toBeInTheDocument();
      expect(screen.getByText("Example Content")).toBeInTheDocument();
    });
  });

  it("handles answer input changes", async () => {
    render(
      <Router>
        <Activity />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Question 1?")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("answer1"), {
      target: { value: "Answer 1" },
    });
    expect(screen.getByLabelText("answer1").value).toBe("Answer 1");
  });

  it("submits answers", async () => {
    axios.post.mockResolvedValue({ data: {} });

    render(
      <Router>
        <Activity />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Question 1?")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("answer1"), {
      target: { value: "Answer 1" },
    });

    fireEvent.click(screen.getByText("Finalizar"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/answer",
        expect.any(Object)
      );
    });
  });
});
