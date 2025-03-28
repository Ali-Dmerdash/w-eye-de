'use client';

import type { Metadata } from 'next';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Api } from '@/state/api';


const store = configureStore({
    reducer: {
        [Api.reducerPath]: Api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(Api.middleware),
});

// Metadata export (will still work but with limitations)
export const metadata: Metadata = {
    title: 'Eyide',
};

export default function DashboardWrapper({ children,}: { children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <div className="dashboard">
                {children}
            </div>
        </Provider>
    );
}

// Export store types for component usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;