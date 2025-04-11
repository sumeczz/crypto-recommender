// api.js
// Funkce pro komunikaci s CoinGecko API přes proxy

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'; // Dočasný proxy (pro produkci použijte vlastní)
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Funkce pro načtení dat s mezipamětí
async function fetchWithCache(url, cacheKey, cacheTime = 5 * 60 * 1000) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheTime) {
            console.log(`Načteno z mezipaměti: ${cacheKey}`);
            return data;
        }
    }

    try {
        console.log(`Načítám: ${url}`);
        const response = await fetch(PROXY_URL + url);
        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }
        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        return data;
    } catch (error) {
        console.error(`Chyba při načítání ${url}:`, error);
        return null;
    }
}

async function fetchCryptoList() {
    const data = await fetchWithCache(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true`,
        'crypto_list'
    );
    console.log('Seznam kryptoměn načten:', data?.length || 0, 'položek');
    return data || [];
}

async function fetchCryptoDetails(id) {
    const data = await fetchWithCache(
        `${COINGECKO_API}/coins/${id}?tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=true`,
        `crypto_details_${id}`
    );
    console.log(`Detaily pro ${id} načteny`);
    return data;
}

async function fetchPriceHistory(id, days = 30) {
    const data = await fetchWithCache(
        `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
        `price_history_${id}`
    );
    console.log(`Cenová historie pro ${id} načtena`);
    return data;
}

async function fetchMarketSentiment(id) {
    // Placeholder: Náhodný sentiment
    const sentiments = ['Pozitivní', 'Neutrální', 'Negativní'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
}