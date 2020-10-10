describe('Douglas homepage tests', () => {

    beforeEach(() => {
        cy.visit('https://www.douglas.nl/');
        cy.get('#uc-btn-accept-banner').click();
    });

    it('Checks search request', () => {
        cy.server();
        cy.route('GET', '/suggestBox*').as('searchRequest');

        cy.get('.rd__input-text[name=query]').type('mascara');
        cy.wait('@searchRequest').should((req) => {
            expect(req.url).to.match(/query=mascara/);
        });
    });

    it('Shows search results', () => {
        cy.server();
        cy.route('GET', '/suggestBox*', '<div id="testResults">test</div>').as('searchRequest');

        cy.get('.rd__input-text[name=query]').type('mascara');
        cy.wait('@searchRequest');
        cy.get('#testResults').should('be.visible');
    });
});