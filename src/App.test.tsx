import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login page link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Login Page/i); // checks that an element with the text Login Page is rendered
  expect(linkElement).toBeInTheDocument();
});
