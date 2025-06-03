import axios from "axios";
import express from "express";
import detectVCP from "../utils/vcpDetector";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

router.get("/scan", async (req, res) => {
  try {
    // Nifty 50 stocks (partial list)
    const stocks = [
      "RELIANCE.NS",
      "TCS.NS",
      "HDFCBANK.NS",
      "INFY.NS",
      "TATASTEEL.NS",
    ];
    const vcpSetups = [];

    for (const symbol of stocks) {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      );
      const data = Object.values(response.data["Time Series (Daily)"])
        .slice(0, 200)
        .map((d) => ({
          close: parseFloat(d["4. close"]),
          high: parseFloat(d["2. high"]),
          low: parseFloat(d["3. low"]),
          volume: parseInt(d["5. volume"]),
        }));

      const vcp = detectVCP(data);
      if (vcp) {
        vcpSetups.push({ symbol, ...vcp });
      }
    }

    res.json(vcpSetups);
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Error scanning for VCPs" });
  }
});

export default router;
