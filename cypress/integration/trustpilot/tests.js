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

    it.only('Checks percentage of reviews', () => {
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
    })
});