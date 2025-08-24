// resources/js/bootstrap.js
import axios from 'axios'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// Grab CSRF token from Blade <meta> tag
const token = document.head.querySelector('meta[name="csrf-token"]')
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
    console.warn('CSRF token not found: <meta name="csrf-token"> is missing')
}

// Send cookies with requests (needed for Laravel session)
axios.defaults.withCredentials = true

// Optional: export or attach globally if you use window.axios elsewhere
window.axios = axios
export default axios
