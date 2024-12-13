import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders App component", () => {
  render(<App />);
  const linkElement = screen.getByText("learn react");
  expect(linkElement).toBeInTheDocument();
});

test("renders button and handles click", () => {
  render(<App />);
  const buttonElement = screen.getByRole("button", { name: "click me" });
  expect(buttonElement).toBeInTheDocument();
  fireEvent.click(buttonElement);
  const clickedMessage = screen.getByText("button clicked");
  expect(clickedMessage).toBeInTheDocument();
});

test("renders input and handles change", () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText("enter text");
  expect(inputElement).toBeInTheDocument();
  fireEvent.change(inputElement, { target: { value: "test input" } });
  expect(inputElement.value).toBe("test input");
});
