import Quiz from "../../client/src/components/Quiz";

describe("<Quiz />", () => {
  // when the quiz page is first loaded
  describe("when the component initially renders", () => {
    it("displays the start quiz button", () => {
      cy.mount(<Quiz />);
      cy.get("button").contains("Start Quiz").should("be.visible");
    });
  });

  // when the start quiz button is clicked
  describe('when the "Start Quiz" button is clicked', () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/questions/random", {
        fixture: "questions.json",
      }).as("getQuestions");
      cy.mount(<Quiz />);
      // fetch the questions after the comonent mounts
      cy.get("button").contains("Start Quiz").click();
      // wait for the intercepted API call to finish
      // Once this step is complte, the response can be accessed by using the alias
      // cy.get("@getQuestions").its("response")...
      cy.wait("@getQuestions");
    });

    it("displays the first question", () => {
      cy.get(".card").should("be.visible");
      cy.get("@getQuestions")
        .its("response")
        .then((response) => {
          cy.get(".card h2")
            .contains(response.body[0].question)
            .should("be.visible");
        });
    });

    it("displays the the answer options to the first question", () => {
      cy.get(".card").should("be.visible");
      cy.get("@getQuestions")
        .its("response")
        .then((response) => {
          // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
          // console.log(response.body[0].answers[0].text);
          response.body[0].answers.forEach(
            (answer: { text: string }, index: number) => {
              cy.get(".card div")
                .children()
                .eq(index)
                .contains(answer.text)
                .should("be.visible");
              cy.get(".card button")
                .contains(index + 1)
                .should("be.visible");
            }
          );
        });
    });
  });

  // when an answer is selected
  describe("when an answer is selected", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/questions/random", {
        fixture: "questions.json",
      }).as("getQuestions");
      cy.mount(<Quiz />);
      // fetch the questions after the comonent mounts
      cy.get("button").contains("Start Quiz").click();
      // wait for the intercepted API call to finish
      // Once this step is complte, the response can be accessed by using the alias
      // cy.get("@getQuestions").its("response")...
      cy.wait("@getQuestions");
      // answer the first question
      cy.get(".card button").eq(0).click();
    });

    // it should display the next question
    it("displays the next question", () => {
      cy.get(".card").should("be.visible");
      cy.get("@getQuestions")
        .its("response")
        .then((response) => {
          const question = response.body[1];
          cy.get(".card h2").contains(question.question).should("be.visible");
        });
    });
  });

  // when the quiz is completed
  describe("when the quiz is completed", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/questions/random", {
        fixture: "questions.json",
      }).as("getQuestions");
      cy.mount(<Quiz />);
      // fetch the questions after the comonent mounts
      cy.get("button").contains("Start Quiz").click();
      /*
       * wait for the intercepted API call to finish
       * Once this step is complte, the response can
       * be accessed by using the alias
       * cy.get("@getQuestions").its("response")...
       */
      cy.wait("@getQuestions");

      // answer the first question incorrectly
      cy.get("@getQuestions")
        .its("response")
        .then((response) => {
          const question = response.body[0];
          const incorrectAnswerIndex = question.answers
            // create an array of boolean values
            .map((answer: { isCorrect: boolean }) => answer.isCorrect)
            // find the index of the first incorrect answer
            .indexOf(false);
          console.log("incorrectAnswerIndex **********", incorrectAnswerIndex);
          cy.get(".card button").eq(incorrectAnswerIndex).click();
        });

      // answer the second question correctly
      cy.get("@getQuestions")
        .its("response")
        .then((response) => {
          const question = response.body[0];
          const correctAnswerIndex = question.answers
            // create an array of boolean values
            .map((answer: { isCorrect: boolean }) => answer.isCorrect)
            // find the index of the first incorrect answer
            .indexOf(false);
          cy.get(".card button").eq(correctAnswerIndex).click();
        });
    });

    it("displays quiz is completed", () => {
      cy.get(".alert-success").should("be.visible");
      cy.get(".card h2").contains("Quiz Completed").should("be.visible");
      cy.get(".alert-success").should("have.text", "Your score: 1/2");
    });

    // it should display the correct score
    it("displays the correct score", () => {
      cy.get(".alert-success").should("have.text", "Your score: 1/2");
    });

    // it should display the take new quiz button
    it("displays the take new quiz button", () => {
      cy.get("button").contains("Take New Quiz").should("be.visible");
    });

    // when a the new quiz button is clicked after quiz is completed
    describe("when the new quiz button is clicked", () => {
      beforeEach(() => {
        cy.get("button").contains("Take New Quiz").click();
      });

      it("displays the first question", () => {
        cy.get(".card").should("be.visible");
        cy.get("@getQuestions")
          .its("response")
          .then((response) => {
            cy.get(".card h2")
              .contains(response.body[0].question)
              .should("be.visible");
          });
      });

      it("should reset the score", () => {
        cy.get(".alert-success").should("not.exist");
      });
    });
  });
});
