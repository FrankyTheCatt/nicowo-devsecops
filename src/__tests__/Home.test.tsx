import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("@/components/TodoApp", () => {
  return function MockTodoApp() {
    return <main>TodoApp mock</main>;
  };
});

describe("Home", () => {
  it("renderiza TodoApp", () => {
    render(<Home />);

    expect(screen.getByText("TodoApp mock")).toBeInTheDocument();
  });
});
