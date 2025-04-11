// utils.js
// Pomocné funkce pro formátování a manipulaci s daty

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatPercentage(value) {
    return `${value.toFixed(2)}%`;
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('cs-CZ');
}