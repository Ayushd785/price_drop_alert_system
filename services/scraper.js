const axios = require("axios");
const cheerio = require("cheerio");

// ScraperAPI configuration
const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_API_URL = "https://api.scraperapi.com/";

const scrapeUrl = async (asin) => {
  const amazonUrl = `https://www.amazon.in/dp/${asin}`;

  // Check if API key is configured
  if (!SCRAPER_API_KEY) {
    console.error("SCRAPER_API_KEY is not set in environment variables");
    return null;
  }

  try {
    console.log(`Scraping product: ${asin}`);

    // ScraperAPI parameters
    const payload = {
      api_key: SCRAPER_API_KEY,
      url: amazonUrl,
      country_code: "in", // For Amazon India
      render: "true", // Render JavaScript
      premium: "true", // Use premium proxies for better success rate
      session_number: Math.floor(Math.random() * 1000), // Random session for IP rotation
    };

    // Make request to ScraperAPI
    const response = await axios.get(SCRAPER_API_URL, {
      params: payload,
      timeout: 30000, // 30 second timeout
    });

    if (response.status !== 200) {
      console.error(`ScraperAPI returned status: ${response.status}`);
      return null;
    }

    // Parse HTML with cheerio
    const $ = cheerio.load(response.data);

    // Extract product title
    const title =
      $("#productTitle").text().trim() ||
      $("h1.a-size-large").text().trim() ||
      $('h1[data-automation-id="title"]').text().trim();

    // Extract price with multiple selectors
    let price = null;
    const priceSelectors = [
      ".a-price-whole",
      ".a-price .a-offscreen",
      "#priceblock_dealprice",
      "#priceblock_ourprice",
      "#priceblock_saleprice",
      ".a-price-range .a-price .a-offscreen",
      '[data-a-color="price"] .a-offscreen',
      ".a-price.a-text-price.a-size-medium.apexPriceToPay .a-offscreen",
    ];

    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        // Extract numbers from price text (remove currency symbols, commas, etc.)
        const priceMatch = priceText.match(/[\d,]+(?:\.\d+)?/);
        if (priceMatch) {
          price = parseFloat(priceMatch[0].replace(/,/g, ""));
          break;
        }
      }
    }

    // Extract image URL
    let image = null;
    const imageSelectors = [
      "#landingImage",
      "#imgTagWrapperId img",
      ".a-dynamic-image",
      "#main-image",
      "#imageBlock img",
    ];

    for (const selector of imageSelectors) {
      const imgElement = $(selector).first();
      if (imgElement.length) {
        image = imgElement.attr("src") || imgElement.attr("data-src");
        if (image && image.startsWith("http")) {
          break;
        }

        // Try to get from data-a-dynamic-image attribute
        const dynamicImageData = imgElement.attr("data-a-dynamic-image");
        if (dynamicImageData) {
          try {
            const imageObj = JSON.parse(dynamicImageData);
            const imageUrls = Object.keys(imageObj);
            if (imageUrls.length > 0) {
              image = imageUrls[0];
              break;
            }
          } catch (e) {
            // Continue to next selector
          }
        }
      }
    }

    // Validate extracted data
    if (!title) {
      console.error("Could not extract product title");
      return null;
    }

    if (!price) {
      console.error("Could not extract product price");
      return null;
    }

    console.log(`Successfully scraped: ${title} - ₹${price}`);

    return {
      title,
      price,
      image: image || null,
      asin,
      url: amazonUrl,
    };
  } catch (error) {
    console.error("Scraping error:", error.message);

    // Handle specific error cases
    if (error.response) {
      console.error(
        `ScraperAPI error: ${error.response.status} - ${error.response.data}`
      );
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout - Amazon may be blocking requests");
    }

    return null;
  }
};

module.exports = scrapeUrl;
