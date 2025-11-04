export function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Runtime-safe API base that forces live server when a localhost value is detected
export const API_BASE = (() => {
    const live = 'https://appadmin.moonadelivery.com';
    const env = process.env.REACT_APP_API_URL;
    if (!env) return live;
    if (/localhost/i.test(env)) return live;
    return env;
})();


