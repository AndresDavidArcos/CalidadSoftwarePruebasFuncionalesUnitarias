/*eslint-disable*/
const { Builder, By, until } = require('selenium-webdriver');
const { login, addProductToCart } = require('./helpers');

// Función para probar los detalles de checkout
async function testCustomerDetails(email, firstName, lastName, address, postcode, phone) {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await login(driver);
        await addProductToCart(driver);

        await driver.get('http://localhost:1111/checkout/information');

        await driver.wait(until.elementLocated(By.id("shipEmail")), 10000);

        await driver.findElement(By.id("shipEmail")).clear();
        await driver.findElement(By.id("shipEmail")).sendKeys(email);

        await driver.findElement(By.id("shipFirstname")).clear();
        await driver.findElement(By.id("shipFirstname")).sendKeys(firstName);

        await driver.findElement(By.id("shipLastname")).clear();
        await driver.findElement(By.id("shipLastname")).sendKeys(lastName);

        await driver.findElement(By.id("shipAddr1")).clear();
        await driver.findElement(By.id("shipAddr1")).sendKeys(address);

        await driver.findElement(By.id("shipPostcode")).clear();
        await driver.findElement(By.id("shipPostcode")).sendKeys(postcode);

        await driver.findElement(By.id("shipPhoneNumber")).clear();
        await driver.findElement(By.id("shipPhoneNumber")).sendKeys(phone);

        await driver.findElement(By.id("checkoutInformation")).click();

        // Si el test sale bien se redirecciona a esta pagina
        await driver.wait(until.urlContains('/checkout/shipping'), 10000);
        console.log(`Test Passed: ${email}, ${firstName}, ${lastName}, ${address}, ${postcode}, ${phone}`);

    } catch (error) {
        console.log(`Test Failed: ${email}, ${firstName}, ${lastName}, ${address}, ${postcode}, ${phone}`);
        console.error(error);
    } finally {
        await driver.quit();
    }
}

const testCases = [
    // Caso válido
    ["valid@example.com", "John", "Doe", "123 Main St", "2000TW", "123456789"],

    // Casos inválidos de email
    ["invalidemail.com", "John", "Doe", "123 Main St", "2000TW", "123456789"],  // Sin "@"
    ["test@", "John", "Doe", "123 Main St", "2000TW", "123456789"],            // Sin dominio
    ["@example.com", "John", "Doe", "123 Main St", "2000TW", "123456789"],     // Sin nombre de usuario
    ["test@exa!mple.com", "John", "Doe", "123 Main St", "2000TW", "123456789"],// Caracteres especiales no permitidos

    // Casos inválidos de nombre y apellido
    ["valid@example.com", "John1", "Doe", "123 Main St", "2000TW", "123456789"],  // Nombre con número
    ["valid@example.com", "John", "Doe@", "123 Main St", "2000TW", "123456789"],  // Apellido con caracter especial
    ["valid@example.com", "", "Doe", "123 Main St", "2000TW", "123456789"],       // Nombre vacío
    ["valid@example.com", "J".repeat(101), "Doe", "123 Main St", "2000TW", "123456789"], // Nombre excesivamente largo

    // Casos inválidos de dirección
    ["valid@example.com", "John", "Doe", "12345", "2000TW", "123456789"],      // Solo números
    ["valid@example.com", "John", "Doe", "!@#$", "2000TW", "123456789"],       // Caracteres especiales
    ["valid@example.com", "John", "Doe", "", "2000TW", "123456789"],           // Dirección vacía

    // Casos inválidos de código postal
    ["valid@example.com", "John", "Doe", "123 Main St", "20", "123456789"],    // Demasiado corto
    ["valid@example.com", "John", "Doe", "123 Main St", "2000TWWWWW", "123456789"], // Demasiado largo
    ["valid@example.com", "John", "Doe", "123 Main St", "20AA2W", "123456789"],    // Mezcla inadecuada de letras y números

    // Casos inválidos de teléfono
    ["valid@example.com", "John", "Doe", "123 Main St", "2000TW", "12345abc"], // Teléfono con letras
    ["valid@example.com", "John", "Doe", "123 Main St", "2000TW", "123-456!789"], // Caracteres especiales
    ["valid@example.com", "John", "Doe", "123 Main St", "2000TW", ""],         // Campo vacío
    ["valid@example.com", "John", "Doe", "123 Main St", "2000TW", "123"],      // Longitud inválida (demasiado corto)
    ["valid@example.com", "John", "Doe", "123 Main St", "2000TW", "12345678901234567890"] // Longitud inválida (demasiado largo)
];

(async function runTests() {
    for (const caseData of testCases) {
        await testCustomerDetails(...caseData);
    }
})();
