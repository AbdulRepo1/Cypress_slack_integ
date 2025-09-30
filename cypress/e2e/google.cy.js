describe('Google Search Box', () => {
  it(' Verify google search box exist', () => {
    cy.visit('https://www.google.com/')
    cy.get("textarea[title='Search']")
    .should('exist')
    .should('be.visible')
  })
})