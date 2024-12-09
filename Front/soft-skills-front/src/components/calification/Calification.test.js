import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Calification from "./Calification";

// Mock de axios para evitar llamadas reales a la API
jest.mock("axios");

const mockAnswers = [
  { id: 1, question_number: 1, answer_text: "Respuesta 1", rating: -1 },
  { id: 2, question_number: 2, answer_text: "Respuesta 2", rating: -1 },
];

const mockActivities = [
  { id: 1, title: "Título 1", question: "Pregunta 1" },
  { id: 2, title: "Título 2", question: "Pregunta 2" },
];

beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url === "http://127.0.0.1:8000/answer") {
      return Promise.resolve({ data: mockAnswers });
    }
    if (url === "http://127.0.0.1:8000/activity") {
      return Promise.resolve({ data: mockActivities });
    }
    return Promise.reject(new Error("not found"));
  });

  axios.post.mockResolvedValue({ data: {} });
});

test("renders Calification component", async () => {
  render(<Calification />);
  expect(screen.getByText(/Respuestas de los cursos/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      /Aquí puedes ver todas las respuestas del curso que aún no tienen rating o que tienen un rating menor a cero y calificarlas./i
    )
  ).toBeInTheDocument();
});

test("displays loading message when fetching data", () => {
  render(<Calification />);
  expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
});

test("displays questions and answers correctly", async () => {
  render(<Calification />);
  await waitFor(() => {
    expect(screen.getByText(/Título: Título 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Pregunta: Pregunta 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Respuesta: Respuesta 1/i)).toBeInTheDocument();
  });
});

test("allows rating input between 0 and 5", async () => {
  render(<Calification />);
  await waitFor(() => {
    const ratingInput = screen.getByLabelText(/Calificación/i);
    fireEvent.change(ratingInput, { target: { value: "3" } });
    expect(ratingInput.value).toBe("3");
    fireEvent.change(ratingInput, { target: { value: "6" } });
    expect(ratingInput.value).toBe("3"); // No debe cambiar a 6 porque el máximo es 5
  });
});

test("submits rating correctly", async () => {
  render(<Calification />);
  await waitFor(() => {
    const ratingInput = screen.getByLabelText(/Calificación/i);
    fireEvent.change(ratingInput, { target: { value: "4" } });
    const submitButton = screen.getByText(/Enviar Calificación/i);
    fireEvent.click(submitButton);
    // Aquí puedes agregar más verificaciones para asegurarte de que la calificación se envió correctamente
  });
});
