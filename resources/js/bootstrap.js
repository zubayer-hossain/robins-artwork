// resources/js/bootstrap.js
import axios from 'axios'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'

// Grab CSRF token from Blade <meta> tag
const token = document.head.querySelector('meta[name="csrf-token"]')
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
    console.warn('CSRF token not found: <meta name="csrf-token"> is missing')
}

// Send cookies with requests (needed for Laravel session)
axios.defaults.withCredentials = true

// Add response interceptor to handle 419 errors gracefully
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            // CSRF token expired - check if it's a logout request
            const isLogoutRequest = error.config?.url?.includes('logout');
            
            if (isLogoutRequest) {
                // For logout requests, just reload silently
                window.location.reload();
            } else {
                // For other requests, show a message and reload
                if (window.toast) {
                    window.toast.error('Session expired. Refreshing page...', 'Session Expired');
                }
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
        return Promise.reject(error);
    }
);

// Optional: export or attach globally if you use window.axios elsewhere
window.axios = axios
export default axios
