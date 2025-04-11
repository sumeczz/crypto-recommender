const API_BASE = "https://api.coingecko.com/api/v3";

async function fetchCryptoData() {
  const res = await fetch(`${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`);
  const data = await res.json();
  return data;
}

function technicalAnalysis(crypto) {
  const score = crypto.price_change_percentage_24h;
  if (score > 5) return { recommended: true, reason: "Technická analýza: Cena vzrostla o více než 5 % za 24 hodin." };
  if (score < -5) return { recommended: false, reason: "Technická analýza: Cena klesla o více než 5 % za 24 hodin." };
  return { recommended: false, reason: "Technická analýza: Nedostatečný pohyb ceny." };
}

async function showDetail(cryptoId, name) {
  const res = await fetch(`${API_BASE}/coins/${cryptoId}/market_chart?vs_currency=usd&days=7`);
  const data = await res.json();

  const ctx = document.getElementById('price-chart').getContext('2d');
  const prices = data.prices.map(p => p[1]);
  const labels = data.prices.map(p => new Date(p[0]).toLocaleDateString());

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Cena (USD)',
        data: prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  });

  document.getElementById("detail-name").innerText = name;
  document.getElementById("crypto-detail").classList.remove("hidden");
}

async function renderCryptos() {
  const cryptos = await fetchCryptoData();
  const container = document.getElementById("crypto-list");
  container.innerHTML = "";

  cryptos.forEach(crypto => {
    const analysis = technicalAnalysis(crypto);

    if (analysis.recommended) {
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition";
      div.innerHTML = `
        <h3 class="text-xl font-bold">${crypto.name}</h3>
        <p>Cena: $${crypto.current_price}</p>
        <p>Změna 24h: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
        <p>Kapitalizace: $${(crypto.market_cap / 1e9).toFixed(2)}B</p>
        <p>Objem: $${(crypto.total_volume / 1e6).toFixed(2)}M</p>
        <p class="mt-2 text-green-600 font-semibold">${analysis.reason}</p>
      `;
      div.onclick = () => showDetail(crypto.id, crypto.name);
      container.appendChild(div);
    }
  });
}

renderCryptos();