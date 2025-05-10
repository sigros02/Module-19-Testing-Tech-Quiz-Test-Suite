//import Quize component
import Quiz from "../../client/src/components/Quiz";

// Example usage of the Quiz component
describe("Quiz Component", () => {
  it("renders correctly", () => {
    cy.mount(<Quiz />);
  });
});
