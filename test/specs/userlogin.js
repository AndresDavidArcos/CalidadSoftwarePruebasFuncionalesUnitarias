/* eslint-disable */
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Pruebas de Login para el Usuario Cliente", function () {
  let driver;

  // Setup para iniciar el driver
  beforeEach(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  // Cierre del navegador después de cada prueba
  afterEach(async function () {
    await driver.quit();
  });

  // Caso 1: Login con credenciales de Cliente válidas
  it("Debería permitir login con credenciales de cliente válidas", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/customer/login");

    await driver.findElement(By.id("email")).sendKeys("test@test.com");
    await driver.findElement(By.id("password")).sendKeys("test");
    await driver.findElement(By.id("customerloginForm")).click();
    await driver.sleep(2000);

    // Obtener la URL actual
    const currentUrl = await driver.getCurrentUrl();
    assert.strictEqual(
      currentUrl,
      "http://localhost:1111/customer/account",
      "No se navego al panel de cliente después de hacer login"
    );
  });

  // Caso 2: Login con correo de Cliente y contraseña incorrecta
  it("Debería mostrar error al hacer login con contraseña incorrecta", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/customer/login");

    await driver.findElement(By.id("email")).sendKeys("test@test.com");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.id("customerloginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "Access denied. Check password and try again.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 3: Login con correo de Usuario no registrado
  it("Debería mostrar error al intentar login con un correo de usuario no registrado", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/customer/login");

    await driver.findElement(By.id("email")).sendKeys("nonexistent@test.com");
    await driver.findElement(By.id("password")).sendKeys("test");
    await driver.findElement(By.id("customerloginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A customer with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 4: Login con correo de Admin y contraseña incorrecta
  it("Debería mostrar error al hacer login con un correo de administrador", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/customer/login");

    await driver.findElement(By.id("email")).sendKeys("owner@test.com");
    await driver.findElement(By.id("password")).sendKeys("test");
    await driver.findElement(By.id("customerloginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A customer with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 5: Login con correo de Cliente no registrado y contraseña incorrecta
  it("Debería mostrar error al hacer login con correo no registrado y contraseña incorrecta", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/customer/login");

    await driver.findElement(By.id("email")).sendKeys("nonexistent@test.com");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.id("customerloginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A customer with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 6: Login con correo de Cliente y usuario no válido
  it("Debería mostrar error al intentar login con un correo de cliente no válido", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/customer/login");

    await driver.findElement(By.id("email")).sendKeys("wrongcustomer@test.com");
    await driver.findElement(By.id("password")).sendKeys("test");
    await driver.findElement(By.id("customerloginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A customer with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 7: Login con correo de Admin y usuario no válido (contraseña incorrecta)
  it("Debería mostrar error al intentar login con un correo de admin y contraseña incorrecta", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/customer/login");

    await driver.findElement(By.id("email")).sendKeys("owner@test.com");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.id("customerloginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A customer with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 8: Login con correo de Usuario normal y usuario no válido (contraseña incorrecta)
  it("Debería mostrar error al intentar login con correo de usuario no válido y contraseña incorrecta", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/customer/login");

    await driver.findElement(By.id("email")).sendKeys("owner@test.com");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.id("customerloginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A customer with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });
});
