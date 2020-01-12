const {getPriceFromLabel} = require('../parsers');

describe('Trust Pilot Review Page', () => {
    const pageUrl = 'https://nl.trustpilot.com/review/www.bol.com';

    it('Checks business sign up box deletion', () => {
        cy.visit(pageUrl);
        cy.get('.business-signup-box--close').click();
        cy.get('.business-signup-box').should('not.be.visible');
    });

    it('Checks number of reviews', () => {
        cy.visit(pageUrl);
        cy.get('.header--inline').invoke('text').then((headReviewsLabelText) => {
            cy.get('.headline__review-count').invoke('text').then((overviewReviewsLabelText) => {
                expect(getPriceFromLabel(headReviewsLabelText)).to.equal(getPriceFromLabel(overviewReviewsLabelText));
            })
        });
    });

    it('Checks percentage of reviews', () => {
        cy.visit(pageUrl);
        let reviewsPercentageValue = 0;

        cy
            .get('.chart__cell__value')
            .each(($reviewValue) => {
                const reviewValueText = $reviewValue.text();

                reviewsPercentageValue = reviewsPercentageValue + getPriceFromLabel(reviewValueText);
            })
            .then(() => {
                expect(reviewsPercentageValue).to.be.at.least(100);
            });
    });

    it('Checks reviews chart rows', () => {
        cy.visit(pageUrl);
        cy
            .get('.chart__row')
            .click({multiple: true})
            .each(($ratingRow) => {
                const ratingRowClassName = $ratingRow.attr('class');

                expect(ratingRowClassName).to.have.string('highlight');
            });
    });

    it('Checks number of customer reviews', () => {
        cy.visit(pageUrl);

        cy
            .get('.consumer-information__data')
            .first()
            .click()
            .invoke('text')
            .then((customerReviewLabelText) => {
                cy
                    .get('.consumer-information__review-count')
                    .invoke('text')
                    .then((allCustomerReviewsLabelText) => {
                        cy.get('.review-card').should('have.length', getPriceFromLabel(customerReviewLabelText));
                        cy.get('.review-card').should('have.length', getPriceFromLabel(allCustomerReviewsLabelText));
                    });
            });
    });

    it('Checks that total number of reviews on the 1 page is not more than 20', () => {
        cy.visit('https://nl.trustpilot.com/review/www.ah.nl');

        function runTestPage() {
            cy.get('body').then(($body) => {
                const nextPageButtonSelector = '[data-page-number="next-page"]';
                const $nextPageButton = $body.find(nextPageButtonSelector);

                if ($nextPageButton.length > 0) {
                    cy
                        .get('.review-card')
                        .should(($reviewsBlocks) => {
                            expect($reviewsBlocks.length).to.lessThan(21);
                        })
                        .then(() => {
                            cy
                                .get(nextPageButtonSelector)
                                .click()
                                .then(runTestPage);
                        });
                }
            });
        }

        runTestPage();
    });
});