import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';


const app = express();
const port = 5500;
app.use(cors());

await dotenv.config();

const apiKey = process.env.API_KEY;
const weatherKey = process.env.API;

app.get('/get-maps-api-key', async (req, res) => {
    try {
    res.json({ apiKey, weatherKey });
    } catch (error) {
        console.error('error', error)
    }  
  });


  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});
