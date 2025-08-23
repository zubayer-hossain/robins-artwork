import React, { useState, useEffect } from 'react';

// Toast types
export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

// Individual Toast Component
function ToastItem({ toast, onRemove }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Auto remove after duration
        if (toast.duration > 0) {
            const timer = setTimeout(() => handleRemove(), toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 300); // Match exit animation duration
    };

    const getToastStyles = () => {
        const baseStyles = "relative flex items-start p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 ease-out transform";
        const visibilityStyles = isVisible && !isRemoving
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95";

        switch (toast.type) {
            case TOAST_TYPES.SUCCESS:
                return `${baseStyles} ${visibilityStyles} bg-green-50/95 border-green-200 text-green-800`;
            case TOAST_TYPES.ERROR:
                return `${baseStyles} ${visibilityStyles} bg-red-50/95 border-red-200 text-red-800`;
            case TOAST_TYPES.WARNING:
                return `${baseStyles} ${visibilityStyles} bg-yellow-50/95 border-yellow-200 text-yellow-800`;
            case TOAST_TYPES.INFO:
            default:
                return `${baseStyles} ${visibilityStyles} bg-blue-50/95 border-blue-200 text-blue-800`;
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case TOAST_TYPES.SUCCESS:
                return (
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case TOAST_TYPES.ERROR:
                return (
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            case TOAST_TYPES.WARNING:
                return (
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case TOAST_TYPES.INFO:
            default:
                return (
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    return (
        <div className={getToastStyles()}>
            {getIcon()}
            <div className="ml-3 flex-1">
                {toast.title && (
                    <p className="text-sm font-semibold mb-1">{toast.title}</p>
                )}
                <p className="text-sm">{toast.message}</p>
            </div>
            <button
                onClick={handleRemove}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }) {
    if (!toasts || toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onRemove={removeToast} />
                </div>
            ))}
        </div>
    );
}

// Toast Hook
export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: TOAST_TYPES.INFO,
            duration: 4000, // 4 seconds default
            ...toast,
        };
        
        setToasts(prev => [...prev, newToast]);
        return id;
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (message, title = null, options = {}) => {
        return addToast({
            type: TOAST_TYPES.SUCCESS,
            message,
            title,
            ...options
        });
    };

    const error = (message, title = null, options = {}) => {
        return addToast({
            type: TOAST_TYPES.ERROR,
            message,
            title,
            duration: 6000, // Longer duration for errors
            ...options
        });
    };

    const warning = (message, title = null, options = {}) => {
        return addToast({
            type: TOAST_TYPES.WARNING,
            message,
            title,
            ...options
        });
    };

    const info = (message, title = null, options = {}) => {
        return addToast({
            type: TOAST_TYPES.INFO,
            message,
            title,
            ...options
        });
    };

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info
    };
}

// Global Toast Provider Component
export function ToastProvider({ children }) {
    const toast = useToast();

    // Make toast available globally
    useEffect(() => {
        window.toast = toast;
    }, [toast]);

    return (
        <>
            {children}
            <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
        </>
    );
}
