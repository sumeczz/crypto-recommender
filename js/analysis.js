// analysis.js
// Algoritmy pro analýzu a doporučení kryptoměn
// Vysvětlení:

    // Implementuje technickou analýzu: klouzavé průměry (MA), RSI, MACD a detekci vzorů.
    // Hodnotí fundamentální ukazatele (tržní pozice, poměr objemu k tržní kapitalizaci).
    // Generuje skóre pro každou kryptoměnu na základě analýzy.
    //  Klasifikuje volatility, potenciální růst a riziko.
    // Vrací seřazený seznam doporučení.

function calculateMovingAverage(prices, period) {
    const ma = [];
    for (let i = period - 1; i < prices.length; i++) {
        const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        ma.push(sum / period);
    }
    return ma;
}

function calculateRSI(prices, period = 14) {
    let gains = 0, losses = 0;
    for (let i = 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses -= change;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function calculateMACD(prices) {
    const ema12 = calculateMovingAverage(prices, 12);
    const ema26 = calculateMovingAverage(prices, 26);
    const macd = ema12.map((val, idx) => val - ema26[idx]);
    const signal = calculateMovingAverage(macd, 9);
    return { macd, signal };
}

function detectPricePatterns(prices) {
    // Placeholder: Detekce základního vzoru (např. růstový trend)
    const recentPrices = prices.slice(-5);
    const isUptrend = recentPrices.every((p, i) => i === 0 || p >= recentPrices[i - 1]);
    return isUptrend ? 'Růstový trend' : 'Není detekován jasný vzor';
}

function analyzeCrypto(crypto, priceHistory) {
    const prices = priceHistory?.prices?.map(p => p[1]) || [];
    
    // Technická analýza
    const ma50 = calculateMovingAverage(prices, 50);
    const ma200 = calculateMovingAverage(prices, 200);
    const rsi = calculateRSI(prices);
    const { macd, signal } = calculateMACD(prices);
    const pattern = detectPricePatterns(prices);

    // Fundamentální analýza (příklad)
    const marketCapRank = crypto.market_cap_rank || 100;
    const volumeToCap = crypto.total_volume / crypto.market_cap;
    
    // Hodnocení
    let score = 0;
    if (ma50[ma50.length - 1] > ma200[ma200.length - 1]) score += 30; // Zlatý kříž
    if (rsi < 30) score += 20; // Přeprodané
    if (macd[macd.length - 1] > signal[signal.length - 1]) score += 20; // Býčí MACD
    if (volumeToCap > 0.1) score += 15; // Vysoký objem
    if (marketCapRank <= 50) score += 15; // Vysoká kapitalizace

    // Klasifikace volatility, růstu a rizika
    const volatility = crypto.price_change_percentage_24h > 10 ? 'high' : crypto.price_change_percentage_24h > 5 ? 'medium' : 'low';
    const growth = score > 70 ? 'high' : score > 50 ? 'medium' : 'low';
    const risk = marketCapRank > 50 ? 'high' : marketCapRank > 20 ? 'medium' : 'low';

    return {
        score,
        volatility,
        growth,
        risk,
        reasons: {
            technical: `MA50: ${ma50[ma50.length - 1]?.toFixed(2)}, RSI: ${rsi?.toFixed(2)}, Vzor: ${pattern}`,
            fundamental: `Tržní pozice: ${marketCapRank}, Poměr objemu: ${volumeToCap.toFixed(2)}`,
            sentiment: 'Čeká na data' // Placeholder
        }
    };
}

function generateRecommendations(cryptos, priceHistories) {
    return cryptos
        .map((crypto, idx) => ({
            ...crypto,
            analysis: analyzeCrypto(crypto, priceHistories[idx])
        }))
        .sort((a, b) => b.analysis.score - a.analysis.score)
        .slice(0, 12); // Top 12 doporučení
}