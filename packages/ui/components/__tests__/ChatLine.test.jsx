import { render, screen } from "@testing-library/react";
import ChatLine from "../ChatLine";

describe("<ChatLine />", () => {
  it("should render the content as text", () => {
    render(<ChatLine role={"user"} content={"Hello world!"} />);
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });

  it("Ensure that there is at least one line break in the text", () => {
    render(<ChatLine role="assistant" content="Olá, meu nome é IAna.\n" />);
    const lineBreaks = screen.getAllByTestId(/^line-break/);
    expect(lineBreaks).toHaveLength(1);
  });
});


