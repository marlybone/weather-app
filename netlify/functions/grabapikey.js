import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
exports.handler = async (event, context) => {
    try {
      const apiKey = process.env.API_KEY;
      const weatherKey = process.env.API;
  
      return {
        statusCode: 200,
        body: JSON.stringify({ apiKey, weatherKey }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'An error occurred' }),
      };
    }
  };
  

export default app;
