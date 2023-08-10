import express from 'express';
import cors from 'cors';


const app = express();

const apiKey = process.env.API_KEY;
const weatherKey = process.env.API;
app.use(cors());
app.get('/grabapikey', async (req, res) => {
  try {
      res.json({ apiKey, weatherKey });
      console.log(apiKey, weatherKey )
  } catch (error) {
      console.error('error', error);
      res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = app;
  

export default app;
