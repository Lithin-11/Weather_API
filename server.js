require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const url = `${process.env.SCRAPE_API_FIRST}${city}${process.env.SCRAPE_API_LAST}`;
        
        const page = await axios.get(url);
        const $ = cheerio.load(page.data);

        const date = $(process.env.DATE_CLASS).text().trim();
        const temperature = $(process.env.TEMPERATURE_CLASS).text().trim();
        const min_temp = $(process.env.MINMAX_CLASS).eq(0).text().trim();
        const max_temp = $(process.env.MINMAX_CLASS).eq(1).text().trim();

        res.json({
            city,
            date,
            temperature,
            min_temp,
            max_temp
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});