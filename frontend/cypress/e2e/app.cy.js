// cypress/e2e/app.cy.js

describe("Navigation", () => {
  it("Should open the login page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // The page should contain "Inloggen"
    cy.contains("Inloggen");
  });
});
