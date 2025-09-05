import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from './Components/Toast';
import { CartProvider } from './Contexts/CartContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Function to update body attributes based on auth state
const updateBodyAuthAttributes = (auth) => {
    const body = document.body;
    const isAuthenticated = auth?.user ? 'true' : 'false';
    const userRoles = auth?.user?.roles ? auth.user.roles.join(',') : '';
    
    body.setAttribute('data-auth', isAuthenticated);
    body.setAttribute('data-user-roles', userRoles);
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Update body attributes on initial load
        updateBodyAuthAttributes(props.initialPage.props.auth);

        root.render(
            <CartProvider>
                <ToastProvider>
                    <App {...props} />
                </ToastProvider>
            </CartProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Listen for Inertia page changes and update body attributes
document.addEventListener('inertia:success', (event) => {
    const auth = event.detail.page.props.auth;
    updateBodyAuthAttributes(auth);
});
