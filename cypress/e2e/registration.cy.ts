describe('Registration Test', () => {
  beforeEach(() => {
    cy.visit('/registration');
  });

  it('should display registration form', () => {
    cy.get('input[name=username]').should('be.visible');
    cy.get('input[name=birthdate]').should('be.visible');
    cy.get('input[name=firstname]').should('be.visible');
    cy.get('input[name=lastname]').should('be.visible');
    cy.get('input[name=phoneNumber]').should('be.visible');
    cy.get('input[name=gender]').should('be.visible');
    cy.get('input[name=email]').should('be.visible');
    cy.get('input[name=password]').should('be.visible');
    cy.get('input[name=passwordVerif]').should('be.visible');
    cy.get('input[name=street]').should('be.visible');
    cy.get('input[name=number]').should('be.visible');
    cy.get('input[name=city]').should('be.visible');
    cy.get('input[name=postalCode]').should('be.visible');
    cy.get('input[type=submit]').should('be.visible');
  });

  it('should fail validation with invalid email', () => {
    cy.get('input[name=email]').type('user123@gmail.');
    cy.get('input[name=password]').type('PasswordTest1234!');
    cy.get('input[name=passwordVerif]').type('PasswordTest1234!');
    cy.contains('The email address is invalid.').should('be.visible');
  });

  it('should fail validation with non-matching passwords', () => {
    cy.get('input[name=email]').type('user123@gmail.com');
    cy.get('input[name=password]').type('PasswordTest1234!');
    cy.get('input[name=passwordVerif]').type('DifferentPassword');
    cy.contains('Passwords are not the same.').should('be.visible');
  });

  it('should pass validation with correct credentials', () => {
    cy.get('input[name=username]').type('UserTest');
    cy.get('input[name=birthdate]').type('2000-01-01');
    cy.get('input[name=firstname]').type('User123');
    cy.get('input[name=lastname]').type('User123');
    cy.get('input[name=phoneNumber]').type('06498231658');
    cy.get('input[name=gender][value="Male"]').check();
    cy.get('input[name=email]').type('user123@gmail.com');
    cy.get('input[name=password]').type('PasswordTest1234!');
    cy.get('input[name=passwordVerif]').type('PasswordTest1234!');
    cy.get('input[name=street]').type('Rue de la test');
    cy.get('input[name=number]').type('665');
    cy.get('input[name=city]').type('Test');
    cy.get('input[name=postalCode]').type('645');
    cy.get('input[name=country]').type('Belgium');
    cy.get('input[type=submit]').click();
    cy.url().should('include', '/home'); // Vérifiez que vous êtes redirigé vers la bonne URL après une inscription réussie
  });
});
