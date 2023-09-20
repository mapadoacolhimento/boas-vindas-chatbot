import { render, screen, fireEvent } from "@testing-library/react";
import ChatSuggestions from "../ChatSuggestions";

describe("<ChatSuggestions />", () => {
  it("should render all the suggestions buttons", () => {
    const handleClick = () => {}
    render(<ChatSuggestions handleClick={handleClick} />);

    expect(screen.getByText(/Tipos de serviço público/i)).toBeInTheDocument();
    expect(screen.getByText(/Mapa de serviços públicos/i)).toBeInTheDocument();
    expect(screen.getByText(/Como fazer para encaminhar?/i)).toBeInTheDocument();
    expect(screen.getByText(/Como denunciar?/i)).toBeInTheDocument();
    expect(screen.getByText(/Como fazer a articulação?/i)).toBeInTheDocument();
  });

  it("Ensure when there is onClick, return the text", () => {
    const handleClick = jest.fn();
    render(<ChatSuggestions handleClick={handleClick} />);

    const button = screen.queryByText(/Tipos de serviço público/i);

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  })
})