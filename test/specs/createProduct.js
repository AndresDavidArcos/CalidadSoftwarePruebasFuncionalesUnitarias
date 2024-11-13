/* eslint-disable */
const { Builder, By, until } = require('selenium-webdriver');
const { loginAsAdmin } = require('../helpers');
jest.setTimeout(30000);

let testCases = [
    // Casos válidos e inválidos para Product title
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Titulo de producto con al menos 5 caracteres", isValid: true, testField: "productTitle" },
    { productTitle: "", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Titulo vacio", isValid: false, testField: "productTitle" },
    { productTitle: "Bike", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Titulo con menos de 5 caracteres", isValid: false, testField: "productTitle" },

    // Casos válidos e inválidos para Product price
    { productTitle: "Bicicleta", productPrice: "10", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Precio numerico positivo con formato correcto", isValid: true, testField: "productPrice" },
    { productTitle: "Bicicleta", productPrice: "abc", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Precio con caracteres no numericos", isValid: false, testField: "productPrice" },
    { productTitle: "Bicicleta", productPrice: "-10", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Precio negativo", isValid: false, testField: "productPrice" },
    { productTitle: "Bicicleta", productPrice: "", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Precio vacio", isValid: false, testField: "productPrice" },

    // Casos válidos e inválidos para Product GTIN
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "GTIN con 12 digitos", isValid: true, testField: "productGtin" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "GTIN vacio", isValid: false, testField: "productGtin" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "12345", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "GTIN con longitud incorrecta", isValid: false, testField: "productGtin" },

    // Casos válidos e inválidos para Product description
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto excelente", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Descripcion con texto adecuado, minimo 5 caracteres", isValid: true, testField: "productDescription" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Descripcion vacia", isValid: false, testField: "productDescription" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Test", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Descripcion con menos de 5 caracteres", isValid: false, testField: "productDescription" },

    // Casos válidos e inválidos para Product Brand
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Marca con texto adecuado", isValid: true, testField: "productBrand" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Marca vacia", isValid: false, testField: "productBrand" },

    // Casos válidos e inválidos para Permalink
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Permalink con formato de URL adecuado", isValid: true, testField: "productPermalink" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Permalink vacio", isValid: false, testField: "productPermalink" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "invalid@url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Permalink con caracteres especiales no permitidos", isValid: false, testField: "productPermalink" },

    // Casos válidos e inválidos para Subscription plan
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Codigo de plan de suscripcion valido", isValid: true, testField: "productSubscription" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Codigo de plan de suscripcion vacio", isValid: false, testField: "productSubscription" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "incorrecto_plan", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Codigo de plan de suscripcion con formato incorrecto", isValid: false, testField: "productSubscription" },

    // Casos válidos e inválidos para Allow comment
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Opcion de permitir comentarios seleccionada", isValid: true, testField: "productComment" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: null, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Sin ninguna seleccion de comentarios", isValid: false, testField: "productComment" },

    // Casos válidos e inválidos para Product tag words
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Palabras clave alfanumericas separadas por comas", isValid: true, testField: "productTags-tokenfield" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "", status: "Published", description: "Palabras clave vacias", isValid: false, testField: "productTags-tokenfield" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta@", status: "Published", description: "Palabras clave con caracteres no permitidos", isValid: false, testField: "productTags-tokenfield" },

    // Casos válidos e inválidos para Status
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Estado seleccionado como 'Published'", isValid: true, testField: "productPublished" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Draft", description: "Estado seleccionado como 'Draft'", isValid: true, testField: "productPublished" },
    { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "plan_XXXXXXXXXXXXXX", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "", description: "Sin ninguna seleccion de estado", isValid: false, testField: "productPublished" },
];
/*
 testCases = [
     { productTitle: "Bicicleta", productPrice: "10.99", productGtin: "123456789012", productBrand: "MarcaValida", productDescription: "Producto de alta calidad MOTIVO VIAJE", permalink: "valid-url", subscriptionPlan: "incorrecto_plan", allowComment: true, productTagWords: "etiqueta1, etiqueta2", status: "Published", description: "Codigo de plan de suscripcion con formato incorrecto", isValid: false, testField: "productSubscription" },
] */

describe("Pruebas de Partición de Equivalencias en Formulario de Producto", () => {
    testCases.forEach(testCase => {
        test(testCase.description, async () => {
            let driver;
            try {
                driver = await new Builder().forBrowser('chrome').build();
                await driver.manage().window().maximize();
                await loginAsAdmin(driver);

                // Navegar al formulario de nuevo producto
                await driver.get('http://localhost:1111/admin/product/new');

                // Guardar la URL actual (del formulario de nuevo producto)
                const formUrl = await driver.getCurrentUrl();

                // Llenar el formulario con los datos del caso de prueba
                if (testCase.productTitle !== undefined) {
                    await driver.findElement(By.id("productTitle")).sendKeys(testCase.productTitle);
                }
                if (testCase.productPrice !== undefined) {
                    await driver.findElement(By.id("productPrice")).sendKeys(testCase.productPrice);
                }
                if (testCase.productGtin !== undefined) {
                    await driver.findElement(By.id("productGtin")).sendKeys(testCase.productGtin);
                }
                if (testCase.productBrand !== undefined) {
                    await driver.findElement(By.id("productBrand")).sendKeys(testCase.productBrand);
                }
                if (testCase.productDescription !== undefined) {
                    await driver.findElement(By.css(".note-editable")).sendKeys(testCase.productDescription);
                }
                if (testCase.permalink !== undefined) {
                    await driver.findElement(By.id("productPermalink")).sendKeys(`${testCase.permalink}-${Date.now()}`);
                }
                if (testCase.productTagWords !== undefined) {
                    await driver.findElement(By.id("productTags-tokenfield")).sendKeys(testCase.productTagWords);
                }
                if (testCase.subscriptionPlan !== undefined) {
                    await driver.findElement(By.id("productSubscription")).sendKeys(testCase.subscriptionPlan);
                }

                if (testCase.allowComment) {
                    await driver.findElement(By.id("productComment")).click();
                }

                const statusDropdown = await driver.findElement(By.id("productPublished"));
                await statusDropdown.findElement(By.xpath(`//option[. = '${testCase.status}']`)).click();

                // Enviar el formulario
                await driver.findElement(By.id("frm_edit_product_save")).click();

                // Verificación según la validez del caso de prueba
                if (testCase.isValid) {
                    // Caso válido: esperar redirección a la URL de edición
                    await driver.wait(until.urlContains("/admin/product/edit/"), 5000);
                    const currentUrl = await driver.getCurrentUrl();
                    expect(currentUrl).toContain("/admin/product/edit/");
                } else {
                    // Caso inválido: el formulario no debe redirigirse
                    const formUrl = await driver.getCurrentUrl();
                    let currentUrl;

                    try {
                        // Esperar hasta que haya una redirección o hasta que pase el tiempo límite
                        await driver.wait(async () => {
                            currentUrl = await driver.getCurrentUrl();
                            return currentUrl !== formUrl; // Verifica si hubo una redirección
                        }, 5000);
                    } catch (e) {
                        // Si el tiempo de espera expira, significa que no hubo redirección
                        currentUrl = formUrl;
                    }

                    const mandatoryFields = ['productTitle', 'productPrice', 'productDescription'];
                    const isMandatoryFieldEmpty = mandatoryFields.some(field => testCase[field] === "");

                    if (isMandatoryFieldEmpty) {
                        // Si un campo obligatorio está vacío, no debería haber redirección
                        expect(currentUrl).toBe(formUrl);
                    } else {
                        // Si se trata de un campo opcional vacío u otro tipo de error, no hay redirección
                        expect(currentUrl).toBe(formUrl);
                    }
                }
            } catch (error) {
                throw error;
            } finally {
                if (driver) await driver.quit();
            }
        });
    });
});
