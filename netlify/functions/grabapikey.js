import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.get('/get-maps-api-key', async (req, res) => {
  try {
      const apiKey = process.env.API_KEY;
      const weatherKey = process.env.API;

      res.json({ apiKey, weatherKey });
  } catch (error) {
      console.error('error', error);
      res.status(500).json({ error: 'An error occurred' });
  }
});
  

export default app;
