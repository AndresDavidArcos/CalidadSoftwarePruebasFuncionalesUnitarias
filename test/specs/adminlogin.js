/* eslint-disable */
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { adminLogin } = require("./helpers"); // Importa el helper de adminLogin

describe("Pruebas de Login", function () {
  let driver;

  // Setup para iniciar el driver
  beforeEach(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  // Cierre del navegador después de cada prueba
  afterEach(async function () {
    await driver.quit();
  });

  // Caso 1: Login con credenciales de Admin válidas
  it("Debería permitir login con credenciales de admin válidas", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/admin/login");

    await driver.findElement(By.id("email")).sendKeys("owner@test.com");
    await driver.findElement(By.id("password")).sendKeys("test");
    await driver.findElement(By.id("loginForm")).click();
    await driver.sleep(2000);
    // Obtener la URL actual
    const currentUrl = await driver.getCurrentUrl();

    // Asegurarse de que la URL sea la esperada
    assert.strictEqual(
      currentUrl,
      "http://localhost:1111/admin/dashboard",
      "No se navego al dashboard después de hacer login"
    );
  });

  // Caso 2: Login con correo de Usuario normal válido
  it("Debería mostrar error al intentar login con un usuario normal", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/admin/login");

    await driver.findElement(By.id("email")).sendKeys("test@test.com");
    await driver.findElement(By.id("password")).sendKeys("test");
    await driver.findElement(By.id("loginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A user with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 3: Login con correo de Admin y contraseña incorrecta
  it("Debería mostrar error al hacer login con contraseña incorrecta", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/admin/login");

    await driver.findElement(By.id("email")).sendKeys("owner@test.com");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.id("loginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.ok(
      errorMessage.includes("Access denied"),
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 4: Login con correo de Usuario normal y contraseña válida
  it("Debería mostrar error al intentar login con un usuario normal", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/admin/login");

    await driver.findElement(By.id("email")).sendKeys("user@test.com");
    await driver.findElement(By.id("password")).sendKeys("validpassword");
    await driver.findElement(By.id("loginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A user with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 5: Login con correo de Admin y usuario no válido
  it("Debería mostrar error al intentar login con un correo de admin incorrecto", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/admin/login");

    await driver.findElement(By.id("email")).sendKeys("incorrect@test.com");
    await driver.findElement(By.id("password")).sendKeys("test");
    await driver.findElement(By.id("loginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A user with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 6: Login con correo de Usuario normal y usuario no válido
  it("Debería mostrar error al intentar login con un correo de usuario incorrecto", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/admin/login");

    await driver.findElement(By.id("email")).sendKeys("incorrect@test.com");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.id("loginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A user with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 7: Login con correo de Admin y usuario no válido (contraseña incorrecta)
  it("Debería mostrar error al intentar login con usuario incorrecto y contraseña incorrecta", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/admin/login");

    await driver.findElement(By.id("email")).sendKeys("incorrect@test.com");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.id("loginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A user with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });

  // Caso 8: Login con correo de Usuario normal y usuario no válido (contraseña incorrecta)
  it("Debería mostrar error al intentar login con usuario normal incorrecto y contraseña incorrecta", async function () {
    this.timeout(15000);
    await driver.get("http://localhost:1111/admin/login");

    await driver.findElement(By.id("email")).sendKeys("incorrect@test.com");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.id("loginForm")).click();
    await driver.sleep(2000);

    const notifyMessageElement = await driver.wait(
      until.elementLocated(By.id("notify_message")),
      20000
    );
    await driver.wait(until.elementIsVisible(notifyMessageElement), 5000);

    const errorMessage = await notifyMessageElement.getText();
    assert.strictEqual(
      errorMessage,
      "A user with that email does not exist.",
      "El mensaje de error no es el esperado."
    );
  });
});
