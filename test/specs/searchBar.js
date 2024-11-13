/* eslint-disable */
const { Builder, By, until } = require('selenium-webdriver');

jest.setTimeout(30000);

describe("Pruebas de barra de búsqueda de productos", () => {

    test("Búsqueda con término válido", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await driver.get('http://localhost:1111');

            const searchInput = await driver.findElement(By.id('frm_search'));
            const searchButton = await driver.findElement(By.id('btn_search'));

            await searchInput.sendKeys('Scout Backpack');
            await searchButton.click();

            const productTitle = await driver.findElement(By.css('h3.product-title.product-title-home.top-pad-10'));
            const titleText = await productTitle.getText();

            expect(titleText).toBe('Scout Backpack');
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Búsqueda con término no existente", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await driver.get('http://localhost:1111');

            const searchInput = await driver.findElement(By.id('frm_search'));
            const searchButton = await driver.findElement(By.id('btn_search'));

            await searchInput.sendKeys('ProductoInexistente');
            await searchButton.click();

            const noProductsMessage = await driver.findElement(By.css('p.text-danger')).getText();
            expect(noProductsMessage).toBe('No products found');
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Búsqueda vacía", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await driver.get('http://localhost:1111');

            const searchInput = await driver.findElement(By.id('frm_search'));
            const searchButton = await driver.findElement(By.id('btn_search'));

            const currentUrlBeforeSearch = await driver.getCurrentUrl();

            await searchButton.click();

            const currentUrlAfterSearch = await driver.getCurrentUrl();
            expect(currentUrlBeforeSearch).toBe(currentUrlAfterSearch);

            const productTitles = await driver.findElements(By.css('h3.product-title.product-title-home.top-pad-10'));
            expect(productTitles.length).toBeGreaterThan(0);
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Búsqueda con término parcial", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await driver.get('http://localhost:1111');

            const searchInput = await driver.findElement(By.id('frm_search'));
            const searchButton = await driver.findElement(By.id('btn_search'));

            await searchInput.sendKeys('Back');
            await searchButton.click();

            const productTitle = await driver.findElement(By.css('h3.product-title.product-title-home.top-pad-10'));
            const titleText = await productTitle.getText();

            expect(titleText.toLowerCase()).toContain('back');
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Búsqueda con término con caracteres especiales al principio (#asd)", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await driver.get('http://localhost:1111');

            const searchInput = await driver.findElement(By.id('frm_search'));
            const searchButton = await driver.findElement(By.id('btn_search'));

            await searchInput.sendKeys('#asd');
            await searchButton.click();

            const noProductsMessage = await driver.findElement(By.css('p.text-danger')).getText();
            expect(noProductsMessage).toBe('No products found');
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Búsqueda con término con caracteres especiales al principio (?asd)", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await driver.get('http://localhost:1111');

            const searchInput = await driver.findElement(By.id('frm_search'));
            const searchButton = await driver.findElement(By.id('btn_search'));

            await searchInput.sendKeys('?asd');
            await searchButton.click();

            const noProductsMessage = await driver.findElement(By.css('p.text-danger')).getText();
            expect(noProductsMessage).toBe('No products found');
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Búsqueda con caracteres especiales en medio (asd#)", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await driver.get('http://localhost:1111');

            const searchInput = await driver.findElement(By.id('frm_search'));
            const searchButton = await driver.findElement(By.id('btn_search'));

            await searchInput.sendKeys('asd#');
            await searchButton.click();

            const noProductsMessage = await driver.findElement(By.css('p.text-danger')).getText();
            expect(noProductsMessage).toBe('No products found');
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Búsqueda con caracteres especiales al final (asd@)", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await driver.get('http://localhost:1111');

            const searchInput = await driver.findElement(By.id('frm_search'));
            const searchButton = await driver.findElement(By.id('btn_search'));

            await searchInput.sendKeys('asd@');
            await searchButton.click();

            const noProductsMessage = await driver.findElement(By.css('p.text-danger')).getText();
            expect(noProductsMessage).toBe('No products found');
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

    test("Búsqueda con longitud máxima", async () => {
        let driver;
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.manage().window().maximize();
            await driver.get('http://localhost:1111');

            const searchInput = await driver.findElement(By.id('frm_search'));
            const searchButton = await driver.findElement(By.id('btn_search'));

            await searchInput.sendKeys('a'.repeat(100)); // 100 caracteres
            await searchButton.click();

            const productTitles = await driver.findElements(By.css('h3.product-title.product-title-home.top-pad-10'));
            expect(productTitles.length).toBeGreaterThan(0);
        } catch (error) {
            throw error;
        } finally {
            if (driver) await driver.quit();
        }
    });

});
