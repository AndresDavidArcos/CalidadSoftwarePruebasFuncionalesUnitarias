
const { Builder, By, until } = require('selenium-webdriver');
const { login, addProductToCart } = require('../helpers');



async function testCustomerDetails({ email, firstName, lastName, address, postcode, phone, description, isValid }) {
    let driver;
    try {
        driver = await new Builder().forBrowser('chrome').build();

        await login(driver);
        await addProductToCart(driver);

        await driver.get('http://localhost:1111/checkout/information');

        // Esperar a que los campos sean interactuables
        await driver.wait(until.elementIsVisible(driver.findElement(By.id("shipEmail"))), 10000);

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

        const currentUrl = await driver.getCurrentUrl();
        if (isValid && currentUrl.includes('/checkout/shipping')) {
            console.log(`Test Passed: ${description} | Datos: Email=${email}, Nombre=${firstName}, Apellido=${lastName}, Dirección=${address}, Código Postal=${postcode}, Teléfono=${phone}`);
        } else if (!isValid && currentUrl.includes('/checkout/information')) {
            console.log(`Test Passed (Invalid Class Rejected): ${description} | Datos: Email=${email}, Nombre=${firstName}, Apellido=${lastName}, Dirección=${address}, Código Postal=${postcode}, Teléfono=${phone}`);
        } else {
            throw new Error(`Test Failed: ${description} | Datos: Email=${email}, Nombre=${firstName}, Apellido=${lastName}, Dirección=${address}, Código Postal=${postcode}, Teléfono=${phone}`);
        }

    } catch (error) {
        if (isValid) {
            console.error(`Test Failed: ${description} | Datos: Email=${email}, Nombre=${firstName}, Apellido=${lastName}, Dirección=${address}, Código Postal=${postcode}, Teléfono=${phone}`);
        }
        throw error;
    } finally {
        await driver.quit();
    }
}

// casos de prueba
const testCases = [
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123456789", description: "Caso válido", isValid: true },

    // Casos inválidos de email
    { email: "invalidemail.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123456789", description: "Email sin @", isValid: false },
    { email: "test@", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123456789", description: "Email sin dominio", isValid: false },
    { email: "@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123456789", description: "Email sin nombre de usuario", isValid: false },
    { email: "test@exa!mple.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123456789", description: "Email con caracteres especiales", isValid: false },

    // Casos inválidos de nombre y apellido
    { email: "valid@example.com", firstName: "John1", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123456789", description: "Nombre con número", isValid: false },
    { email: "valid@example.com", firstName: "John", lastName: "Doe@", address: "123 Main St", postcode: "2000TW", phone: "123456789", description: "Apellido con caracter especial", isValid: false },
    { email: "valid@example.com", firstName: "", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123456789", description: "Nombre vacío", isValid: false },
    { email: "valid@example.com", firstName: "J".repeat(101), lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123456789", description: "Nombre excesivamente largo", isValid: false },

    // Casos inválidos de dirección
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "12345", postcode: "2000TW", phone: "123456789", description: "Dirección solo números", isValid: false },
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "!@#$", postcode: "2000TW", phone: "123456789", description: "Dirección con caracteres especiales", isValid: false },
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "", postcode: "2000TW", phone: "123456789", description: "Dirección vacía", isValid: false },

    // Casos inválidos de código postal
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "20", phone: "123456789", description: "Código postal demasiado corto", isValid: false },
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TWWWWW", phone: "123456789", description: "Código postal demasiado largo", isValid: false },
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "20AA2W", phone: "123456789", description: "Código postal con mezcla inválida", isValid: false },

    // Casos inválidos de teléfono
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "12345abc", description: "Teléfono con letras", isValid: false },
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123-456!789", description: "Teléfono con caracteres especiales", isValid: false },
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "", description: "Teléfono vacío", isValid: false },
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "123", description: "Teléfono demasiado corto", isValid: false },
    { email: "valid@example.com", firstName: "John", lastName: "Doe", address: "123 Main St", postcode: "2000TW", phone: "12345678901234567890", description: "Teléfono demasiado largo", isValid: false },
];

describe("Checkout Form Tests", () => {
    testCases.forEach((testCase) => {
        test(testCase.description, async () => {
            await testCustomerDetails(testCase);
        });
    });
});
