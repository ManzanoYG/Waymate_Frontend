describe('Login Test', () => {
  beforeEach(() => {
    cy.visit('/connection');
  });

  it('should display login form', () => {
    cy.get('input[name=email]').should('be.visible');
    cy.get('input[name=password]').should('be.visible');
    cy.get('input[type=submit]').should('be.visible');
  });

  it('should fail validation with invalid email', () => {
    cy.get('input[name=email]').type('captain.rex');
    cy.get('input[name=password]').type('PasswordTest1234!');
    cy.contains('The email address is invalid.').should('be.visible');
  });

  it('should fail validation with incorrect password', () => {
    cy.get('input[name=email]').type('captain.rex@republicarmy.com');
    cy.get('input[name=password]').type('DifferentPassword2!');
    cy.get('input[type=submit]').click();
    cy.contains('You have entered the wrong credentials.').should('be.visible');
  });

  it('should pass validation with correct credentials', () => {
    cy.get('input[name=email]').type('captain.rex@republicarmy.com');
    cy.get('input[name=password]').type('PasswordTest1234!');
    cy.get('input[type=submit]').click();
    cy.url().should('include', '/home');
  });
});
