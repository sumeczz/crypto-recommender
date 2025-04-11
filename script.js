// === Přepínání světlého / tmavého režimu ===
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
  });
  
  // === Akceptace cookies ===
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  
  if (!localStorage.getItem('cookiesAccepted')) {
    cookieBanner.style.display = 'block';
  }
  
  acceptCookies.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieBanner.style.display = 'none';
  });
  
  // === Fiktivní aktualizace BTC indexu a tržní kapitalizace ===
  document.getElementById('btc-index').innerText = '$64,350';
  document.getElementById('market-cap').innerText = '$2.48 bil.';
  document.getElementById('total-cap').innerText = '$2.48 bil.';
  document.getElementById('daily-volume').innerText = '$103 mld.';
  document.getElementById('btc-dominance').innerText = '49.1%';
  
  // === Rotující fakta ===
  const facts = [
    'Bitcoin je omezený na 21 milionů mincí.',
    'Ethereum je největší platforma pro smart kontrakty.',
    'Stablecoiny drží hodnotu vůči fiat měnám.',
  ];
  let factIndex = 0;
  
  setInterval(() => {
    factIndex = (factIndex + 1) % facts.length;
    document.getElementById('fun-fact').innerText = facts[factIndex];
  }, 8000);
  
  // === Fiktivní události ===
  const events = [
    'Ethereum Dencun upgrade 15. dubna',
    'Zasedání Fedu – 17. dubna',
    'Bitcoin halving – za 12 dní',
  ];
  
  const eventList = document.getElementById('market-events-list');
  eventList.innerHTML = '';
  events.forEach(event => {
    const li = document.createElement('li');
    li.textContent = event;
    eventList.appendChild(li);
  });
  
  // === Dynamické načtení kryptoměn – pouze maketa ===
  const cryptos = [
    {
      name: 'Bitcoin',
      price: 64350,
      change: 2.5,
      score: 9,
      reason: 'Dominantní pozice na trhu, pozitivní sentiment.',
    },
    {
      name: 'Ethereum',
      price: 3220,
      change: 1.2,
      score: 8,
      reason: 'Přechod na PoS a DeFi ekosystém.',
    },
  ];
  
  const topCryptos = document.getElementById('top-cryptos');
  
  cryptos.forEach(crypto => {
    const card = document.createElement('div');
    card.className = 'crypto-card';
  
    card.innerHTML = `
      <h4>${crypto.name}</h4>
      <div class="price">$${crypto.price}</div>
      <div class="change" style="color: ${crypto.change >= 0 ? 'limegreen' : 'red'}">
        ${crypto.change >= 0 ? '+' : ''}${crypto.change}% za 24h
      </div>
      <div class="score">Skóre: ${crypto.score}/10</div>
      <p>${crypto.reason}</p>
      <button>Zobrazit detail</button>
    `;
  
    topCryptos.appendChild(card);
  });
  