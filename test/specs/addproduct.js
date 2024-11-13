/* eslint-disable */
const { Builder, By, until, errors } = require('selenium-webdriver');
const assert = require('assert');
const { login } = require('./helpers');  // Importando la función login del helper

async function runTestCase(driver, option, quantity) {
    async function addProduct(option, quantity) {
        // Abrir el formulario de producto
        await driver.get('http://localhost:1111/product/ranger-boot');
        await driver.wait(until.elementLocated(By.css('.product-title')), 10000);
        console.log("Product form opened");

        // Selección de opción de tipo/tamaño de producto
        const optionField = await driver.findElement(By.id('product_variant'));
        await driver.wait(until.elementIsVisible(optionField), 10000);
        await optionField.click();
        
        try {
            if (option) {
                // Intentamos seleccionar la opción del desplegable
                await driver.findElement(By.xpath(`//option[text()="${option}"]`)).click();
                console.log("Product option selected.");
            }
        } catch (error) {
            if (error instanceof errors.NoSuchElementError) {
                // Si no encontramos el elemento, mostramos un mensaje y lanzamos un error
                console.log(`The option "${option}" is not available in the dropdown.`);
                assert.fail(`Option "${option}" is not available in the dropdown.`);
            } else {
                throw error; // Si el error no es del tipo NoSuchElementError, lo lanzamos nuevamente
            }
        }

        // Campo de cantidad
        const quantityField = await driver.findElement(By.id('product_quantity'));
        await quantityField.clear();
        await quantityField.sendKeys(quantity !== undefined ? quantity.toString() : '');
        console.log("Quantity entered.");

        // Validar que la cantidad no sea inválida
        const quantityValue = await quantityField.getAttribute("value");

        if (!quantityValue || isNaN(quantityValue) || quantityValue < 1 || quantityValue > 25) {
            // Si la cantidad es inválida, verificamos que el botón "Add to cart" esté deshabilitado
            const addToCartButton = await driver.findElement(By.css('.product-add-to-cart'));
            const isButtonEnabled = await addToCartButton.isEnabled();

            assert.strictEqual(isButtonEnabled, false, "The 'Add to cart' button should be disabled for invalid quantity.");
            console.log("Add to cart button is disabled for invalid quantity.");
            return; // No enviar el formulario si la cantidad es inválida
        }

        // Si la cantidad es válida, hacer clic en el botón para agregar al carrito
        const addToCartButton = await driver.findElement(By.css('.product-add-to-cart'));
        await addToCartButton.click();
        console.log("Product added.");

        // Esperar el mensaje de notificación
        const notifyMessageElement = await driver.findElement(By.id('notify_message'));
        await driver.wait(until.elementIsVisible(notifyMessageElement), 30000);

        // Obtener el texto del mensaje de notificación
        const actualMessage = await notifyMessageElement.getText();
        console.log(`Notification message: ${actualMessage}`);
        return actualMessage;
    }

    const result = await addProduct(option, quantity);
    return result;
}

describe('Product Form Tests', function() {
    let driver;

    beforeEach(async function() {
        this.timeout(10000);
        driver = await new Builder().forBrowser('chrome').build();
        
        // Login antes de cada prueba utilizando la función del helper
        await login(driver);
    });

    afterEach(async function() {
        await driver.quit();
    });

    const testCases = [
        { option: "Medium", quantity: 3, expected: "Product successfully added" },
        { option: "", quantity: 5, expected: "Please select a product option" },
        { option: "XL", quantity: 5, expected: "Please select a valid product option" },
        { option: "Medium", quantity: 1, expected: "Product successfully added" },
        { option: "Medium", quantity: 0, expected: "Quantity must be at least 1" },
        { option: "Medium", quantity: 5, expected: "Product successfully added" },
        { option: "Medium", quantity: 26, expected: "Quantity cannot exceed 25" },
        { option: "Medium", quantity: "", expected: "Please supply a product quantity" },
        { option: "Medium", quantity: "ABC", expected: "Quantity must be a number" }
    ];

    testCases.forEach((testCase, index) => {
        it(`Case ${index + 1}: ${testCase.expected}`, async function() {
            const actualMessage = await runTestCase(driver, testCase.option, testCase.quantity);

            // Verificación de que el mensaje de notificación sea el esperado
            assert.ok(
                actualMessage === testCase.expected || actualMessage === "Cart successfully updated",
                `Expected "${testCase.expected}" or "Cart successfully updated", but got "${actualMessage}"`
            );
        });
    });
});
