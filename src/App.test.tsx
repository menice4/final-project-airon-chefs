import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login page link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Testing number 4/i); // Adjust this text based on what your app renders
  expect(linkElement).toBeInTheDocument();
});
