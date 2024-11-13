/*eslint-disable*/
const { Builder, By, until } = require("selenium-webdriver");
const { loginAsAdmin } = require('../helpers');

function getFutureDate(daysOffset) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

let testCases = [
    {
        discountCode: `CODE20-${Date.now()}`,
        discountType: "Percent",
        discountValue: "20",
        discountStart: getFutureDate(1),
        discountEnd: getFutureDate(30),
        description: "Código válido con valor porcentual",
        isValid: true,
    },
    {
        discountCode: `CODE50-${Date.now()}`,
        discountType: "Amount",
        discountValue: "50",
        discountStart: getFutureDate(1),
        discountEnd: getFutureDate(15),
        description: "Código válido con valor de cantidad",
        isValid: true,
    },
    {
        discountCode: `EMPTY-${Date.now()}`,
        discountType: "Percent",
        discountValue: "20",
        discountStart: getFutureDate(1),
        discountEnd: getFutureDate(30),
        description: "Código de descuento vacío",
        isValid: false,
    },
    {
        discountCode: `CODE30-${Date.now()}`,
        discountType: "Percent",
        discountValue: "-10",
        discountStart: getFutureDate(1),
        discountEnd: getFutureDate(30),
        description: "Valor de descuento negativo",
        isValid: false,
    },
    {
        discountCode: `CODE25-${Date.now()}`,
        discountType: "Amount",
        discountValue: "1000",
        discountStart: getFutureDate(1),
        discountEnd: getFutureDate(5),
        description: "Valor de descuento muy alto",
        isValid: false,
    },
    {
        discountCode: `CODEEXTRA-${Date.now()}`,
        discountType: "Percent",
        discountValue: "10",
        discountStart: "32/12/2023 12:00",
        discountEnd: getFutureDate(30),
        description: "Fecha de inicio inválida",
        isValid: false,
    },
    {
        discountCode: `CODENEWYEAR-${Date.now()}`,
        discountType: "Percent",
        discountValue: "5",
        discountStart: getFutureDate(10),
        discountEnd: getFutureDate(5),
        description: "Fecha de fin anterior a la de inicio",
        isValid: false,
    }
];

jest.setTimeout(30000);

describe("Pruebas de Partición de Equivalencias en Formulario de Descuento", () => {
    testCases.forEach((testCase) => {
        test(testCase.description, async () => {
            let driver;
            try {
                driver = await new Builder().forBrowser("chrome").build();
                await driver.manage().window().maximize();
                await loginAsAdmin(driver);

                await driver.get("http://localhost:1111/admin/settings/discount/new");

                await driver.findElement(By.id("discountCode")).sendKeys(testCase.discountCode);
                await driver.findElement(By.id("discountType")).sendKeys(testCase.discountType);
                await driver.findElement(By.id("discountValue")).sendKeys(testCase.discountValue);
                await driver.findElement(By.id("discountStart")).sendKeys(testCase.discountStart);
                await driver.findElement(By.id("discountEnd")).sendKeys(testCase.discountEnd);

                const formUrl = await driver.getCurrentUrl();
                let currentUrl;

                await driver.executeScript("document.querySelector('.btn-outline-success').click();");

                try {
                    await driver.wait(async () => {
                        currentUrl = await driver.getCurrentUrl();
                        return currentUrl !== formUrl;
                    }, 5000);
                } catch (e) {
                    currentUrl = formUrl;
                }

                if (testCase.isValid) {
                    expect(currentUrl).toContain("/admin/settings/discount/edit/");
                } else {
                    expect(currentUrl).toBe(formUrl);
                }
            } catch (error) {
                throw error;
            } finally {
                if (driver) await driver.quit();
            }
        });
    });
});
