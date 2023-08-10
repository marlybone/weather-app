const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');


const app = express();
const port = 5500;
app.use(cors());

const apiKey = process.env.API_KEY;
const weatherKey = process.env.API;

app.get('/get-maps-api-key', async (req, res) => {
    try {
        res.json({ apiKey, weatherKey });
    } catch (error) {
        console.error('error', error);
    }
});

module.exports = app;
