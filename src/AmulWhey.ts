import { chromium } from "@playwright/test";
import { readFile } from "fs/promises";
import * as path from "path";

//Interfaces for the Json obj of config file
interface Product {
  name: string;
  link: string;
}

interface Data {
  pinCode: string;
  productsLinks: [Product];
}

// reads the config file and return the parsed json(promise)
async function configReader() {
  const rawData = await readFile(
    path.join(__dirname, "..", "config.json"),
    "utf-8"
  );
  return JSON.parse(rawData);
}

// fills the pin code, and runs a loop to see if products(from config file) are in stock or not
(async () => {
  const dataJson: Data = await configReader();

  const pinCode = dataJson.pinCode;
  const listOfLinks = dataJson.productsLinks;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://shop.amul.com/en/browse/protein");

  await page.locator("#search").fill(pinCode);

  await page.locator("#automatic").waitFor({ state: "visible" });

  await page.getByRole("button").filter({ hasText: pinCode }).click();

  async function checkStock(link: string) {
    await page.goto(link);

    const addToCartButton = page.locator("a", { hasText: /add to cart/i });

    // checks if the add to cart btn enabled or disabled
    const isDisabled = await addToCartButton.getAttribute("disabled");

    if (isDisabled == "true") {
      return false;
    } else return true;
  }

  // runs the list of links to see stock status
  for (const { name, link } of listOfLinks) {
    if (await checkStock(link)) {
      console.log(`${name} is IN stock`);
    } else {
      console.log(`${name} is NOT in stock`);
    }
  }

  await browser.close();
})();
