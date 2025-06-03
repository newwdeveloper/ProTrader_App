import { SMA } from "technicalindicators";

export const detectVcp = (historicalData) => {
  // Fix: 'closes', not 'closes' plural typo
  const closes = historicalData.map((d) => d.close);
  // Fix: variable name should be 'volumes' to match usage and plural consistency
  const volumes = historicalData.map((d) => d.volume);

  // Fix: 'values' not 'value' in SMA.calculate and 'closes' (not close)
  const sma50 = SMA.calculate({ period: 50, values: closes });
  const sma200 = SMA.calculate({ period: 200, values: closes });

  // Check Stage 2 uptrend (Indian market: 50/200 DMA)
  const isStage2 =
    closes[closes.length - 1] > sma50[sma50.length - 1] &&
    closes[closes.length - 1] > sma200[sma200.length - 1];
  if (!isStage2) return null;

  // Detect contractions
  let contractions = [];
  let i = historicalData.length - 1;
  while (i > 0 && contractions.length < 6) {
    const high = Math.max(...historicalData.slice(i - 5, i).map((d) => d.high));
    const low = Math.min(...historicalData.slice(i - 5, i).map((d) => d.low));
    const contraction = ((high - low) / high) * 100;
    contractions.push({ high, low, contraction, volume: volumes[i] });
    i -= 5;
  }

  // Validate VCP
  if (contractions.length < 2 || contractions.length > 6) return null;

  const isValidVCP = contractions.every(
    (c, idx) => idx === 0 || c.contraction < contractions[idx - 1].contraction
  );
  const isVolumeContracting = contractions.every(
    (c, idx) => idx === 0 || c.volume <= contractions[idx - 1].volume
  );
  if (!isValidVCP || !isVolumeContracting) return null;

  return {
    contractions: contractions.reverse(),
    pivotPoint: contractions[0].high,
    isStage2,
    rsScore: calculateRS(historicalData),
  };
};

const calculateRS = (data) => {
  // Simplified RS: Stock vs. Nifty 50
  const stockReturn =
    (data[data.length - 1].close - data[0].close) / data[0].close;
  const niftyReturn = 0.12; // Assume 12% Nifty return (can improve by dynamic fetch)
  return stockReturn > niftyReturn ? 85 : 50;
};

export default detectVcp;
