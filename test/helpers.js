/* eslint-disable */
// helpers.js
const { By, until } = require('selenium-webdriver');

async function login(driver) {
    await driver.get('http://localhost:1111/customer/login');
    await driver.findElement(By.id("email")).sendKeys("test@test.com");
    await driver.findElement(By.id("password")).sendKeys("test");
    await driver.findElement(By.id("customerloginForm")).click();
    await driver.wait(until.urlIs('http://localhost:1111/customer/account'), 10000);
}

async function addProductToCart(driver) {
    await driver.get('http://localhost:1111/');
    const firstProduct = await driver.findElement(By.css('a[href*="/product/"]'));
    await firstProduct.click();

    const cartCountElement = await driver.findElement(By.id("cart-count"));
    const initialCartCount = await cartCountElement.getText();

    await driver.findElement(By.css('.product-add-to-cart')).click();

    await driver.wait(async () => {
        const newCartCount = await cartCountElement.getText();
        return parseInt(newCartCount) > parseInt(initialCartCount);
    }, 10000);
}

module.exports = { login, addProductToCart };
