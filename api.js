// api.js
// Funkce pro komunikaci s CoinGecko API

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

async function fetchCryptoList() {
    try {
        console.log('Načítám seznam kryptoměn...');
        const response = await fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true`);
        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }
        const data = await response.json();
        console.log('Seznam kryptoměn načten:', data.length, 'položek');
        return data;
    } catch (error) {
        console.error('Chyba při načítání seznamu kryptoměn:', error);
        return [];
    }
}

async function fetchCryptoDetails(id) {
    try {
        console.log(`Načítám detaily pro ${id}...`);
        const response = await fetch(`${COINGECKO_API}/coins/${id}?tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=true`);
        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Detaily pro ${id} načteny`);
        return data;
    } catch (error) {
        console.error(`Chyba při načítání detailů kryptoměny ${id}:`, error);
        return null;
    }
}

async function fetchPriceHistory(id, days = 30) {
    try {
        console.log(`Načítám cenovou historii pro ${id}...`);
        const response = await fetch(`${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Cenová historie pro ${id} načtena`);
        return data;
    } catch (error) {
        console.error(`Chyba při načítání cenové historie ${id}:`, error);
        return null;
    }
}

async function fetchMarketSentiment(id) {
    // Placeholder: Náhodný sentiment pro ukázku
    const sentiments = ['Pozitivní', 'Neutrální', 'Negativní'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
}