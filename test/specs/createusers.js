/* eslint-disable */
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { adminLogin } = require('./helpers');

async function runTestCase(driver, username, email, password, confirmPassword) {
    async function fillForm(username, email, password, confirmPassword) {
        // Espera a que el enlace para abrir el formulario de registro esté disponible
        await driver.wait(until.elementLocated(By.css('.nav-item:nth-child(7) > .sidebar-link-addon')), 15000);
        await driver.findElement(By.css('.nav-item:nth-child(7) > .sidebar-link-addon')).click();
        console.log("Registration form opened");

        // Rellenar el formulario de registro
        await driver.wait(until.elementLocated(By.id('usersName')), 15000);
        const usernameField = await driver.findElement(By.id('usersName'));
        await usernameField.sendKeys(username || '');
        console.log("Username entered.");

        const emailField = await driver.findElement(By.id('userEmail'));
        await emailField.sendKeys(email || '');
        console.log("Email entered.");

        const passwordField = await driver.findElement(By.id('userPassword'));
        await passwordField.sendKeys(password || '');
        console.log("Password entered.");

        const confirmPasswordField = await driver.findElement(By.css('#userNewForm > .form-group:nth-child(4) > .form-control'));
        await confirmPasswordField.sendKeys(confirmPassword || '');
        console.log("Confirm password entered.");

        // Enviar el formulario
        await driver.findElement(By.id('btnUserAdd')).click();
        console.log("Form submitted.");

        // Espera a que aparezca el mensaje de notificación
        const notifyMessageElement = await driver.wait(until.elementLocated(By.id('notify_message')), 15000);
        await driver.wait(until.elementIsVisible(notifyMessageElement), 10000);
        const actualMessage = await notifyMessageElement.getText();
        console.log(`Notification message: ${actualMessage}`);
        return actualMessage;
    }

    return await fillForm(username, email, password, confirmPassword);
}

describe('User Registration Form Tests', function() {
    let driver;

    // Aumentar el tiempo de espera de cada prueba
    beforeEach(async function() {
        this.timeout(30000); // Aumenta el tiempo de espera a 30000 ms (30 segundos)
        driver = await new Builder().forBrowser('chrome').build();
        await adminLogin(driver);
    });

    afterEach(async function() {
        await driver.quit();
    });

    const testCases = [
        // Test cases para Username
        { username: "Maicol", email: "maicol@gmail.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Registration successful" },
        { username: "", email: "juanjo@hotmail.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Please supply a username" },
        { username: "abcdefghijklmqwerrsdffguhfghgfjhwertyuygfghjhgfdrty", email: "long@yahoo.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Username is too long" },
        { username: "      ", email: "cesar@correo.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Please supply a valid username" },
        { username: "Juan@321", email: "juan@outlook.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Registration successful" },
        { username: "12345678", email: "juan321@correo.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Registration successful" },

        // Test cases para Email
        { username: "Juan", email: "juaan@dominio.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Registration successful" },
        { username: "JuanA", email: "juandominio.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Please provide a valid email address" },
        { username: "Juan", email: "", password: "Pass#123", confirmPassword: "Pass#123", expected: "Please supply an email address" },
        { username: "Juan", email: "@dominio.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Please provide a valid email address" },
        { username: "Juan", email: "juan@", password: "Pass#123", confirmPassword: "Pass#123", expected: "Please provide a valid email address" },
        { username: "Juan", email: "juan", password: "Pass#123", confirmPassword: "Pass#123", expected: "Please provide a valid email address" },

        // Test cases para Password
        { username: "Juan", email: "juan@dominioouv22.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Registration successful" },
        { username: "Juan", email: "juan@dominio12.com", password: "short", confirmPassword: "short", expected: "Password is too short" },
        { username: "Juan", email: "juannn@sss.com", password: "", confirmPassword: "", expected: "Please supply a password" },
        { username: "Juan", email: "juanito@dd.com", password: "PASSWORD", confirmPassword: "PASSWORD", expected: "Password must contain uppercase and special characters" },
        { username: "Juan", email: "junaaaan@jj.com", password: "password123", confirmPassword: "password", expected: "Passwords do not match" },
        { username: "Juan", email: "juan@dominio22.com", password: "password123", confirmPassword: "password123", expected: "Password must contain uppercase and special characters" },
        { username: "Juan", email: "juan@dominio32.com", password: "PASSWORD123!", confirmPassword: "PASSWORD123!", expected: "Registration successful" },

        // Test cases para Confirm Password
        { username: "Juan", email: "juan@dominio4.com", password: "Pass#123", confirmPassword: "Pass#123", expected: "Registration successful" },
        { username: "Juan", email: "juan@dominio5.com", password: "Pass#123", confirmPassword: "Pass#124", expected: "Passwords do not match" },
        { username: "Juan", email: "juan@dominio6.com", password: "Pass#123", confirmPassword: "", expected: "Please confirm your password" }
    ];

    testCases.forEach((testCase, index) => {
        it(`Case ${index + 1}: ${testCase.expected}`, async function() {
            this.timeout(20000); // Aumenta el tiempo de espera para esta prueba
            const actualMessage = await runTestCase(driver, testCase.username, testCase.email, testCase.password, testCase.confirmPassword);
            
            // Check if the result can be either of the two possible expected values
            if (testCase.expected === "Registration successful") {
                assert.ok(
                    actualMessage === "Registration successful"
                    || actualMessage === "User already exists"
                    || actualMessage === "A user with that email address already exists"
                    || actualMessage === "User account inserted",
                    `Expected "Registration successful"
                    or "User already exists" but got 
                    or "A user with that email address already exists" "${actualMessage}"`
                );
            } else {
                assert.strictEqual(actualMessage, testCase.expected);
            }
        });
    });
});
