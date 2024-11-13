/*eslint-disable*/
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { login } = require('./helpers');

async function runTestCase(driver, title, description, rating) {
    async function addReview(title, description, rating) {
        await driver.findElement(By.id('add-review')).click();
        console.log("Review form opened");

        const reviewTitleField = await driver.findElement(By.id('review-title'));
        await driver.wait(until.elementIsVisible(reviewTitleField), 10000);
        await reviewTitleField.clear();
        await reviewTitleField.sendKeys(title || '');
        console.log("Review title entered.");

        const reviewDescriptionField = await driver.findElement(By.id('review-description'));
        await reviewDescriptionField.clear();
        await reviewDescriptionField.sendKeys(description || '');
        console.log("Review description entered.");

        const reviewRatingField = await driver.findElement(By.id('review-rating'));
        await reviewRatingField.clear();
        await reviewRatingField.sendKeys(rating !== undefined ? rating.toString() : '');
        console.log("Review rating entered.");

        await driver.findElement(By.id('addReview')).click();
        console.log("Review submitted.");

        // Wait for notification message to be visible
        const notifyMessageElement = await driver.findElement(By.id('notify_message'));
        await driver.wait(until.elementIsVisible(notifyMessageElement), 30000);
        
        // Retrieve the notification message text
        const actualMessage = await notifyMessageElement.getText();
        console.log(`Notification message: ${actualMessage}`);
        return actualMessage;
    }

    const result = await addReview(title, description, rating);
    return result;
}

describe('Product Review Tests', function() {
    let driver;

    beforeEach(async function() {
        this.timeout(10000);
        driver = await new Builder().forBrowser('chrome').build();
        await login(driver);
        await driver.get('http://localhost:1111/product/whitney-pullover');
        await driver.wait(until.elementLocated(By.css('.product-title')), 10000);
    });

    afterEach(async function() {
        await driver.quit();
    });

    const testCases = [
        { title: "Genial", description: "Este producto es excelente.", rating: 5, expected: "Review successfully submitted" },
        { title: "", description: "Este producto es excelente.", rating: 5, expected: "Please supply a review title" },
        { title: "Título".repeat(20), description: "Este producto es excelente.", rating: 5, expected: "Review title is too long" },
        { title: "Título que tiene exactamente cincuenta caracteres.", description: "Este producto es excelente.", rating: 5, expected: "Review successfully submitted" },
        { title: "¡Producto Genial!", description: "El producto cumple bien.", rating: 5, expected: "Review successfully submitted" },
        { title: "12345", description: "El producto cumple bien.", rating: 5, expected: "Review successfully submitted" },
        { title: "Genial", description: "El producto cumple bien.", rating: 5, expected: "Review successfully submitted" },
        { title: "Genial", description: "", rating: 5, expected: "Please supply a review description" },
        { title: "Genial", description: "A".repeat(201), rating: 5, expected: "Review description is too long" },
        { title: "Genial", description: "A".repeat(200), rating: 5, expected: "Review successfully submitted" },
        { title: "Genial", description: "¡El mejor producto! 100% recomendado.", rating: 5, expected: "Review successfully submitted" },
        { title: "Genial", description: "1234567890", rating: 5, expected: "Review successfully submitted" },
        { title: "Genial", description: "Producto cumple bien.", rating: 0, expected: "Review successfully submitted" },
        { title: "Genial", description: "Producto cumple bien.", rating: 5, expected: "Review successfully submitted" },
        { title: "Genial", description: "Producto cumple bien.", rating: 6, expected: "Please supply a valid rating" },
        { title: "Genial", description: "Producto cumple bien.", rating: "ABC", expected: "Please supply a valid rating" },
        { title: "Genial", description: "Producto cumple bien.", rating: "", expected: "Please supply a review rating" },
        { title: "Genial", description: "Producto cumple bien.", rating: 3.5, expected: "Review successfully submitted" },
        { title: "Genial", description: "Producto cumple bien.", rating: 5.5, expected: "Please supply a valid rating" },
        { title: "Genial", description: "Producto cumple bien.", rating: -1.5, expected: "Please supply a valid rating" },
        { title: "      ", description: "Producto cumple bien.", rating: 5, expected: "Please supply a review title" },
        { title: "Genial", description: "      ", rating: 5, expected: "Please supply a review description" }
    ];

    testCases.forEach((testCase, index) => {
        it(`Case ${index + 1}: ${testCase.expected}`, async function() {
            const actualMessage = await runTestCase(driver, testCase.title, testCase.description, testCase.rating);
            
            // Check if the result can be either of the two possible expected values
            if (testCase.expected === "Review successfully submitted") {
                assert.ok(
                    actualMessage === "Review successfully submitted" || actualMessage === "Review already submitted",
                    `Expected "Review successfully submitted" or "Review already submitted" but got "${actualMessage}"`
                );
            } else {
                assert.strictEqual(actualMessage, testCase.expected);
            }
        });
    });
});
