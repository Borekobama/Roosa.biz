// CartGenie Loader
(function() {
    if (window.CartgenieLoaded) {
        return;
    }
    window.CartgenieLoaded = true;

    const currentScript = document.currentScript || document.querySelector('script[src*="cartgenie.js"]');
    const baseUrl = currentScript ? new URL(currentScript.src).href.replace(/[^/]*$/, '') : '';

    const script = document.createElement('script');
    script.type = 'module';
    script.async = true;
    script.fetchPriority = 'high';
    script.src = baseUrl + 'cartgenie-main.js';
    document.head.appendChild(script);
})();
