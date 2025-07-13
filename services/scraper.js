const puppeteer = require("puppeteer");

const scrapeUrl = async (asin) => {
  const url = `https://www.amazon.in/dp/${asin}`;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36"
  );
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForSelector("#productTitle", { timeout: 10000 });

    const productData = await page.evaluate(() => {
      const title = document.querySelector("#productTitle")?.innerText?.trim();

      // --- Price ---
      const priceText =
        document.querySelector("#priceblock_dealprice")?.innerText ||
        document.querySelector("#priceblock_ourprice")?.innerText ||
        document.querySelector("#priceblock_saleprice")?.innerText ||
        document.querySelector(".a-price-whole")?.innerText;

      const price = priceText
        ? parseFloat(priceText.replace(/[^0-9.]/g, ""))
        : null;

      // --- Image ---
      let image = null;
      const imgTag =
        document.querySelector("#landingImage") ||
        document.querySelector("#imgTagWrapperId img");

      if (imgTag) {
        const src = imgTag.src;
        if (src && src.startsWith("http")) {
          image = src;
        } else {
          const data = imgTag.getAttribute("data-a-dynamic-image");
          if (data) {
            try {
              image = Object.keys(JSON.parse(data))[0];
            } catch (_) {
              image = null;
            }
          }
        }
      }

      return { title, price, image };
    });
    await browser.close();
    return { ...productData, asin, url };
  } catch (err) {
    console.log("Scrapping error", err.message);
    await browser.close();
    return null;
  }
};

module.exports = scrapeUrl;
