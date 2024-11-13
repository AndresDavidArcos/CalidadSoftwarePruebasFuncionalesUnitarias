/* eslint-disable */
const { Builder, By, until } = require('selenium-webdriver');
const { login, addProductToCart } = require('../helpers');

jest.setTimeout(30000); // Configurar un tiempo de espera más largo para Jest
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe("Quantity Control Tests", () => {

    test("Hacer click en el boton de incrementar cantidad hasta pasar el límite máximo (25)", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await login(driver);
            await addProductToCart(driver);

            await driver.get('http://localhost:1111/checkout/cart');

            for (let i = 0; i < 30; i++) {
                const incrementButton = await driver.findElement(By.css('.btn-qty-add'));
                await driver.executeScript("arguments[0].click();", incrementButton);
                await sleep(50);
            }

            const quantityInput = await driver.findElement(By.css('.cart-product-quantity'));
            const finalQuantity = await quantityInput.getAttribute("value");

            expect(parseInt(finalQuantity)).toBeLessThanOrEqual(25);

        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Hacer click en el boton decrementar cantidad hasta superar el mínimo (1)", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();

            await login(driver);
            await addProductToCart(driver);

            await driver.get('http://localhost:1111/checkout/cart');

            for (let i = 0; i < 5; i++) {
                const decrementButton = await driver.findElement(By.css('.btn-qty-minus'));
                await driver.executeScript("arguments[0].click();", decrementButton);
                await sleep(50);
            }

            const quantityInput = await driver.findElement(By.css('.cart-product-quantity'));
            const finalQuantity = await quantityInput.getAttribute("value");

            expect(parseInt(finalQuantity)).toBeGreaterThanOrEqual(1);

        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Ingresar un valor por encima del máximo (26) directamente", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();

            await login(driver);
            await addProductToCart(driver);

            await driver.get('http://localhost:1111/checkout/cart');

            const quantityInput = await driver.findElement(By.css('.cart-product-quantity'));

            await driver.executeScript(`
                arguments[0].value = ''; 
                arguments[0].value = '26';
                arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
                arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
            `, quantityInput);

            await sleep(100);

            // Verificar si el valor se reseteó automáticamente a 1
            const finalQuantity = await quantityInput.getAttribute("value");
            expect(parseInt(finalQuantity)).toBe(1);
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Ingresar un valor por debajo del mínimo (0) directamente", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();

            await login(driver);
            await addProductToCart(driver);

            await driver.get('http://localhost:1111/checkout/cart');

            const quantityInput = await driver.findElement(By.css('.cart-product-quantity'));

            await driver.executeScript(`
                arguments[0].value = ''; // Limpiar el campo
                arguments[0].value = '0'; // Establecer el valor en 0
                arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
                arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
            `, quantityInput);

            await sleep(100);

            // Verificar si el valor se ajustó automáticamente a 1
            const finalQuantity = await quantityInput.getAttribute("value");
            expect(parseInt(finalQuantity)).toBe(1);
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

});
