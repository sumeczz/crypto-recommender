// main.js
// Hlavní logika aplikace

document.addEventListener('DOMContentLoaded', () => {
    const cryptoList = document.getElementById('crypto-list');
    const modal = document.getElementById('crypto-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDetails = document.getElementById('modal-details');
    const closeModalBtn = document.getElementById('close-modal');
    const filters = {
        volatility: document.getElementById('volatility'),
        growth: document.getElementById('growth'),
        risk: document.getElementById('risk')
    };

    async function loadRecommendations() {
        console.log('Spouštím načítání doporučení...');
        cryptoList.innerHTML = '<p class="text-gray-600">Načítám data...</p>';

        const cryptos = await fetchCryptoList();
        console.log('Načteno kryptoměn:', cryptos.length);

        if (cryptos.length === 0) {
            cryptoList.innerHTML = '<p class="text-red-600">Nepodařilo se načíst data. Zkuste znovu později.</p>';
            return;
        }

        // Načítáme historii jen pro prvních 10 kryptoměn, aby se předešlo 429
        const priceHistories = await Promise.all(
            cryptos.slice(0, 10).map(async (c, idx) => {
                await new Promise(resolve => setTimeout(resolve, idx * 100)); // Prodleva 100ms mezi požadavky
                return fetchPriceHistory(c.id);
            })
        );
        console.log('Načteny cenové historie:', priceHistories.length);

        let recommendations = generateRecommendations(cryptos.slice(0, 10), priceHistories);
        console.log('Vygenerována doporučení:', recommendations);

        // Aplikace filtrů
        const filterValues = {
            volatility: filters.volatility.value,
            growth: filters.growth.value,
            risk: filters.risk.value
        };

        recommendations = recommendations.filter(crypto => {
            return (filterValues.volatility === 'all' || crypto.analysis.volatility === filterValues.volatility) &&
                   (filterValues.growth === 'all' || crypto.analysis.growth === filterValues.growth) &&
                   (filterValues.risk === 'all' || crypto.analysis.risk === filterValues.risk);
        });
        console.log('Po filtrování:', recommendations.length, 'doporučení');

        if (recommendations.length === 0) {
            cryptoList.innerHTML = '<p>Žádná doporučení neodpovídají zvoleným filtrům. Zkuste upravit filtry.</p>';
            return;
        }

        // Vykreslení seznamu
        cryptoList.innerHTML = recommendations.map(crypto => `
            <div class="crypto-card bg-white p-4 rounded-lg shadow cursor-pointer" data-id="${crypto.id}">
                <h3 class="text-lg font-bold">${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
                <p>Cena: ${formatCurrency(crypto.current_price)}</p>
                <p>Změna 24h: <span class="${crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}">${formatPercentage(crypto.price_change_percentage_24h)}</span></p>
                <p>Tržní kapitalizace: ${formatCurrency(crypto.market_cap)}</p>
                <p>Objem obchodů: ${formatCurrency(crypto.total_volume)}</p>
            </div>
        `).join('');
        console.log('Seznam vykreslen');
    }

    // Otevření modálního okna s detaily
    cryptoList.addEventListener('click', async (e) => {
        const card = e.target.closest('.crypto-card');
        if (!card) return;

        const id = card.dataset.id;
        console.log('Otevírám detaily pro:', id);
        const crypto = await fetchCryptoDetails(id);
        const priceHistory = await fetchPriceHistory(id);
        const sentiment = await fetchMarketSentiment(id);

        if (!crypto || !priceHistory) {
            console.error('Nepodařilo se načíst detaily nebo historii');
            modalDetails.innerHTML = '<p class="text-red-600">Chyba při načítání dat.</p>';
            return;
        }

        modalTitle.textContent = `${crypto.name} (${crypto.symbol.toUpperCase()})`;
        modalDetails.innerHTML = `
            <p><strong>Aktuání cena:</strong> ${formatCurrency(crypto.market_data.current_price.usd)}</p>
            <p><strong>Změna 24h:</strong> ${formatPercentage(crypto.market_data.price_change_percentage_24h)}</p>
            <p><strong>Tržní kapitalizace:</strong> ${formatCurrency(crypto.market_data.market_cap.usd)}</p>
            <p><strong>Technická analýza:</strong> ${generateRecommendations([crypto], [priceHistory])[0].analysis.reasons.technical}</p>
            <p><strong>Fundamentální analýza:</strong> ${generateRecommendations([crypto], [priceHistory])[0].analysis.reasons.fundamental}</p>
            <p><strong>Tržní sentiment:</strong> ${sentiment}</p>
        `;

        // Vykreslení grafu
        const ctx = document.getElementById('price-chart').getContext('2d');
        const labels = priceHistory.prices.map(p => formatDate(p[0]));
        const prices = priceHistory.prices.map(p => p[1]);
        createPriceChart(ctx, labels, prices);

        modal.classList.remove('hidden');
    });

    // Zavření modálního okna
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Reakce na změnu filtrů
    Object.values(filters).forEach(filter => {
        filter.addEventListener('change', () => {
            console.log('Filtry změněny, obnovuji doporučení...');
            loadRecommendations();
        });
    });

    // Inicializace a automatické obnovování
    console.log('Inicializuji aplikaci...');
    loadRecommendations().catch(err => {
        console.error('Chyba při inicializaci:', err);
        cryptoList.innerHTML = '<p class="text-red-600">Chyba při načítání dat. Zkuste znovu později.</p>';
    });
    setInterval(() => {
        console.log('Automatická aktualizace dat...');
        loadRecommendations();
    }, 10 * 60 * 1000); // Zvýšeno na 10 minut kvůli limitům API
});