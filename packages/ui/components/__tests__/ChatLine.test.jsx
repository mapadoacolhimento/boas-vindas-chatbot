import { render, screen } from "@testing-library/react";
import ChatLine from "../ChatLine";

describe("<ChatLine />", () => {
  it("should render the content as text", () => {
    render(<ChatLine role={"user"} content={"Hello world!"} />);
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
  it("should render the AI link if has assistant role", () => {
    render(<ChatLine role={"assistant"} content={"Hello world!"} />);
    expect(screen.getByRole("link", { name: /ai/i })).toBeInTheDocument();
  });
  it("should render the you link if has user role", () => {
    render(<ChatLine role={"user"} content={"Hello world!"} />);
    expect(screen.getByRole("link", { name: /you/i })).toBeInTheDocument();
  });
});
