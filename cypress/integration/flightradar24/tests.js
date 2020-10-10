describe('flightradar24 homepage tests', () => {

    beforeEach(() => {
        cy.visit('https://www.flightradar24.com/');
    });

    it('should show empty suggestions list for invalid flight number', () => {
        cy.get('#searchBox').type('abc'.repeat(2));
        cy.get('.ui-menu-item').should('have.class', 'advsearch');
    });

    it('should show an information about chosen flight', () => {
        cy.get('#searchBox').type('KLM641');
        cy.get('.ui-menu-item').first().click();
        cy.get('.flight-info-wrapper [data-component="airlineInfo"]').should('be.visible')
            .invoke('text')
            .should('match', /\/KLM641\s/);
    });

    it('should add and remove filters on filters widget', () => {
        cy.get('[data-content="Filters"]').click();
        cy.get('#fr24_FilterBy_callsign .form-control').type('KLM');
        cy.get('#fr24_FilterAdd').click();
        cy.get('.filter-item').should('contain', 'KLM');
        cy.get('.filter-remove').click();
        cy.get('.filter-item').should('contain', 'No filters');
    });

    it('should search flights by given flight number', () => {
        cy.server();
        cy.route('GET', '/v1/search/web/find**', {
            "results": [
                {
                    "id": "KLM",
                    "label": "KLM (KLM / KL)",
                    "detail": {"iata": "KL", "logo": "s3:KL_KLM.png"},
                    "type": "operator",
                    "match": "icao",
                    "name": "KLM"
                },
                {
                    "id": "2560a196",
                    "label": "KL641 / KLM641 / B78X (PH-BKC)",
                    "detail": {
                        "lat": 56.8,
                        "lon": -46.6,
                        "schd_from": "AMS",
                        "schd_to": "JFK",
                        "ac_type": "B78X",
                        "route": "Amsterdam (AMS) ⟶ New York (JFK)",
                        "logo": "s3:KL_KLM.png",
                        "reg": "PH-BKC",
                        "callsign": "KLM641",
                        "flight": "KL641",
                        "operator": "KLM"
                    },
                    "type": "live",
                    "match": "begins"
                },
                {
                    "id": "KL641",
                    "label": "KL641 / KLM641",
                    "detail": {"logo": "s3:KL_KLM.png", "callsign": "KLM641", "flight": "KL641", "operator": "KLM"},
                    "type": "schedule",
                    "match": "begins"
                }
            ],
            "stats": {
                "total": {"all": 3, "airport": 0, "operator": 1, "live": 1, "schedule": 1, "aircraft": 0},
                "count": {"airport": 0, "operator": 1, "live": 1, "schedule": 1, "aircraft": 0}
            }
        }).as('searchRequest');

        cy.get('#searchBox').type('KLM641');
        cy.wait('@searchRequest');
        cy.get('@searchRequest').should((request) => {
            const url = new URL(request.url);

            expect(url.searchParams.get('query')).to.equal('klm641');
            expect(url.searchParams.get('limit')).to.equal('8');
        });

        cy.get('.ui-menu-item').eq(1).find('.route').should('have.text', 'Amsterdam (AMS) ⟶ New York (JFK)');
    });

    it('should show no search results', () => {
        cy.server();
        cy.route('GET', '/v1/search/web/find**', {
            "results": [],
            "stats": {
                "total": {"all": 0, "airport": 0, "operator": 0, "live": 0, "schedule": 0, "aircraft": 0},
                "count": {"airport": 0, "operator": 0, "live": 0, "schedule": 0, "aircraft": 0}
            }
        }).as('searchRequest');

        cy.get('#searchBox').type('KLM641');
        cy.wait('@searchRequest');
        cy.get('.ui-menu-item').should('have.length', 1).should('have.class', 'advsearch');
    });
});