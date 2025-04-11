// api.js
// Funkce pro komunikaci s CoinGecko API

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

async function fetchCryptoList() {
    try {
        const response = await fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true`);
        return await response.json();
    } catch (error) {
        console.error('Chyba při načítání seznamu kryptoměn:', error);
        return [];
    }
}

async function fetchCryptoDetails(id) {
    try {
        const response = await fetch(`${COINGECKO_API}/coins/${id}?tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=true`);
        return await response.json();
    } catch (error) {
        console.error(`Chyba při načítání detailů kryptoměny ${id}:`, error);
        return null;
    }
}

async function fetchPriceHistory(id, days = 30) {
    try {
        const response = await fetch(`${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
        return await response.json();
    } catch (error) {
        console.error(`Chyba při načítání cenové historie ${id}:`, error);
        return null;
    }
}

// Simulace získání sentimentu (v reálné aplikaci by se použilo např. Twitter API)
async function fetchMarketSentiment(id) {
    // Placeholder: Náhodný sentiment pro ukázku
    const sentiments = ['Pozitivní', 'Neutrální', 'Negativní'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
}