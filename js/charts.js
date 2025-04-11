// charts.js
// Funkce pro vykreslování grafů pomocí Chart.js

let priceChart = null;

function createPriceChart(ctx, labels, prices) {
    if (priceChart) priceChart.destroy(); // Zničí předchozí graf
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Cena (USD)',
                data: prices,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Datum' } },
                y: { title: { display: true, text: 'Cena (USD)' } }
            }
        }
    });
}