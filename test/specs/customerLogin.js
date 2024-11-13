/*eslint-disable*/
const { Builder, By, until } = require('selenium-webdriver');
let testCases = [
    {
        description: "Email y contraseña correctos",
        email: "test@test.com",
        password: "test",
        expectedUrl: "http://localhost:1111/customer/account",
        expectRedirect: true
    },
    {
        description: "Email registrado con contraseña incorrecta",
        email: "test@test.com",
        password: "incorrect",
        expectedMessage: "Access denied. Check password and try again.",
        expectRedirect: false
    },
    {
        description: "Email no registrado",
        email: "notregistered@test.com",
        password: "anyPassword",
        expectedMessage: "A customer with that email does not exist.",
        expectRedirect: false
    },
    {
        description: "Formato de email incorrecto",
        email: "test.com",
        password: "anyPassword",
        expectedMessage: "Invalid email format.",
        expectRedirect: false
    },
    {
        description: "Email vacío",
        email: "",
        password: "anyPassword",
        expectedMessage: "Email is required.",
        expectRedirect: false
    },
    {
        description: "Contraseña vacía",
        email: "test@test.com",
        password: "",
        expectedMessage: "Password is required.",
        expectRedirect: false
    },
    {
        description: "Ambos campos vacíos",
        email: "",
        password: "",
        expectedMessage: "Email and Password are required.",
        expectRedirect: false
    }
];

/* testCases = [ {
    description: "Email registrado con contraseña incorrecta",
    email: "test@test.com",
    password: "incorrect",
    expectedMessage: "Access denied. Check password and try again.",
    expectRedirect: false
}] */

describe("Pruebas de inicio de sesión de cliente", () => {
    testCases.forEach(testCase => {
        test(testCase.description, async () => {
            let driver = await new Builder().forBrowser('chrome').build();
            try {
                await driver.get('http://localhost:1111/customer/login');

                // Llenar el formulario de inicio de sesión
                if (testCase.email !== undefined) {
                    await driver.findElement(By.id("email")).sendKeys(testCase.email);
                }
                if (testCase.password !== undefined) {
                    await driver.findElement(By.id("password")).sendKeys(testCase.password);
                }

                // Enviar el formulario
                await driver.findElement(By.id("customerloginForm")).click();

                if (testCase.expectRedirect) {
                    // Esperar redirección
                    await driver.wait(until.urlIs(testCase.expectedUrl), 5000);
                    const currentUrl = await driver.getCurrentUrl();
                    expect(currentUrl).toBe(testCase.expectedUrl);
                } else {
                    // Verificar el mensaje de error
                    await driver.wait(async () => {
                        const errorMessage = await driver.findElement(By.id("notify_message"));
                        const displayStyle = await errorMessage.getCssValue("display");
                        const messageText = await errorMessage.getText();
                        return displayStyle === "block" && messageText.length > 0;
                    }, 5000);

                    // Capturar y verificar el mensaje de error
                    const errorMessage = await driver.findElement(By.id("notify_message"));
                    const messageText = await errorMessage.getText();
                    console.log("Texto del mensaje de error:", messageText); // Para depuración
                    expect(messageText).toBe(testCase.expectedMessage);
                }
            } finally {
                await driver.quit();
            }
        });
    });
});
