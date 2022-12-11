// ./frontend/src/store/csrf.js
import Cookies from 'js-cookie'; // To get the value of the XSRF-Token

export async function csrfFetch(url, options = {}) {
    options.headers = options.headers || {};
    options.method = options.method || "GET";

    // If options.method is not "GET", set the "Content-Type" header
    // to "application/json" and set the "XSRF-TOKEN" header to the
    // value of the XSRF-TOKEN cookie
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    // Call the default window's fetch
    const res = await window.fetch(url, options);

    // Return the response to the next promise chain, or an error
    if (res.status >= 400) throw res;
    return res;
}

// Call this to get the "XSRF-TOKEN" cookie
// Should only be used in development
export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}