describe('Buienalarm homepage tests', () => {

    beforeEach(() => {
        cy.visit('https://www.buienalarm.nl/');
        cy.get('.ip-consent-btn-action').contains('Ja, ik ga akkoord').click();
    });

    it('Checks searching box', () => {
        cy.server();
        cy.route('GET', '/api/geo/location/**').as('searchRequest');

        cy.get('.autocomplete .input').type('Amsterdam');
        cy.wait('@searchRequest');
        cy.get('@searchRequest').should((request) => {
            expect(request.url).to.match(/\/amsterdam/i);
        });
    });

    it('Checks language switching', () => {
        cy.get('.dropdown .list').should('be.hidden')
            .invoke('show')
            .should('be.visible')
            .find('.btn-lang-en')
            .click();

        cy.url().should('match', '')
    });


});