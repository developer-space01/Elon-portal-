document.getElementById('giftcard-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cardType = document.getElementById('card-type').value;
    const amount = document.getElementById('amount').value;
    const reason = document.getElementById('reason').value;
    const username = localStorage.getItem('username');

    // Save donation record
    await fetch('/api/donation/giftcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, cardType, amount, reason })
    });

    // Pre-fill Telegram message
    const msg = `I want to donate a ${cardType} gift card worth $${amount} for: ${reason}. Please find the gift card image attached.`;
    window.location.href = `https://t.me/Muskfanportal?text=${encodeURIComponent(msg)}`;
});

document.getElementById('crypto-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cryptoType = document.getElementById('crypto-type').value;
    const amount = document.getElementById('crypto-amount').value;
    const reason = document.getElementById('crypto-reason').value;
    const username = localStorage.getItem('username');

    await fetch('/api/donation/crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, cryptoType, amount, reason })
    });

    const msg = `I want to donate ${amount} ${cryptoType} for: ${reason}. Please provide your ${cryptoType} address.`;
    window.location.href = `https://t.me/Muskfanportal?text=${encodeURIComponent(msg)}`;
});
