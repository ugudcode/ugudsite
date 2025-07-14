/**
 * Sets a browser cookie.
 * @param {string} name The name of the cookie.
 * @param {string} value The value of the cookie.
 * @param {number} days The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Gets a cookie value by name.
 * @param {string} name The name of the cookie.
 * @returns {string|null} The cookie value or null if not found.
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('toggle-sidebar');
    const body = document.body;
    const cookieName = 'sidebarState';

    // Set initial state from cookie
    if (getCookie(cookieName) === 'open') {
        body.classList.remove('sidebar-collapsed');
    }

    // Add click listener to toggle and set cookie
    button?.addEventListener('click', () => {
        body.classList.toggle('sidebar-collapsed');
        const newState = body.classList.contains('sidebar-collapsed') ? 'closed' : 'open';
        setCookie(cookieName, newState, 365); // Save state for 1 year
    });
});