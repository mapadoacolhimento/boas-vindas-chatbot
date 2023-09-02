import { render, screen } from "@testing-library/react";
import ChatLine from "../ChatLine";

describe("<ChatLine />", () => {
  it("should render the content as text", () => {
    render(<ChatLine role={"user"} content={"Hello world!"} />);
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
});
