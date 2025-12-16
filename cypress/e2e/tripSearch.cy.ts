describe('Trip Search Component Test', () => {
  beforeEach(() => {
    cy.visit('/tripSearch');
  });

  it('should display the form', () => {
    cy.get('input[name=depart]').should('be.visible');
    cy.get('input[name=destination]').should('be.visible');
    cy.get('input[name=date]').should('be.visible');
    cy.get('input[name=people]').should('be.visible');
    cy.get('button[type=submit]').should('be.visible');
  });

  it('should show "Home Page form not sent." message if form is not submitted', () => {
    cy.contains('Home Page form not sent.').should('be.visible');
  });

  it('should filter trips based on form submission', () => {
    cy.get('input[name=depart]').type('Bruxelles');
    cy.get('input[name=destination]').type('Mouscron');
    cy.get('input[name=date]').type('2024-1-1');
    cy.get('input[name=people]').type('2');
    cy.get('button[type=submit]').click();


    cy.get('.widget-49-title').contains('DepartCity - DestinationCity');
    cy.get('.widget-49-meeting-time').contains('hh:mm to ???? Hrs');
  });

  it('should show "No matching trips found." message if no trips match the filter', () => {

    cy.get('input[name=depart]').type('NonExistentCity');
    cy.get('input[name=destination]').type('AnotherNonExistentCity');
    cy.get('input[name=date]').type('2023-01-01');
    cy.get('input[name=people]').type('1');
    cy.get('button[type=submit]').click();

    cy.contains('No matching trips found.').should('be.visible');
  });

  it('should navigate to trip details when a trip is clicked', () => {
  });
});
