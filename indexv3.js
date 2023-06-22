const express = require('express');
const request = require('request-promise');

// Create an Express app
const app = express();

// Define a port for the app to listen on
const PORT = process.env.PORT || 5000;

// Generate a URL for the Scraper API using the provided API key
const generateScraperUrl = (apiKey) => `http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`;

// Enable the app to parse JSON in request bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Amazon Scraper API now running.');
});

// Validate the provided product ID
const validateProductId = (productId) => /^[A-Z0-9]{10}$/.test(productId);

// Handle errors from the Scraper API
const handleScraperError = (error, res) => {
  if (error.statusCode >= 400 && error.statusCode < 500) {
    res.status(error.statusCode).send({ error: error.message });
  } else {
    console.error(error);
    res.status(500).send({ error: 'An unexpected error occurred' });
  }
};

// GET Product Details endpoint
app.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  if (!validateProductId(productId)) {
    return res.status(400).send({ error: 'Invalid product ID' });
  }

  const { api_key = 'your_default_api_key' } = req.query;

  try {
    const response = await request(`${generateScraperUrl(api_key)}&url=https://www.amazon.com/dp/${productId}`);
    const data = JSON.parse(response);
    const product = {
      title: data.title,
      price: data.price,
      rating: data.rating,
      // ... extract other relevant data
    };
    res.json(product);
  } catch (error) {
    handleScraperError(error, res);
  }
});

// GET Product Reviews endpoint
app.get('/products/:productId/reviews', async (req, res) => {
  const { productId } = req.params;
  if (!validateProductId(productId)) {
    return res.status(400).send({ error: 'Invalid product ID' });
  }

  const { api_key = 'your_default_api_key' } = req.query;

  try {
    const response = await request(`${generateScraperUrl(api_key)}&url=https://www.amazon.com/product-reviews/${productId}`);
    const data = JSON.parse(response);
    const reviews = {
      // ... extract relevant review data
    };
    res.json(reviews);
  } catch (error) {
    handleScraperError(error, res);
  }
});

// GET Product Offers endpoint
app.get('/products/:productId/offers', async (req, res) => {
  const { productId } = req.params;
  if (!validateProductId(productId)) {
    return res.status(400).send({ error: 'Invalid product ID' });
  }

  const { api_key = 'your_default_api_key' } = req.query;

  try {
    const response = await request(`${generateScraperUrl(api_key)}&url=https://www.amazon.com/gp/offer-listing/${productId}`);
    const data = JSON.parse(response);
    const offers = {
      // ... extract relevant offer data
    };
    res.json(offers);
  } catch (error) {
    handleScraperError(error, res);
  }
});

// Start the app listening on the defined port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
