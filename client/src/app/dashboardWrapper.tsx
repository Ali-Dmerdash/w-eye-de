'use client';

import type { Metadata } from 'next';
import { Provider } from 'react-redux';
import { store } from '@/app/redux'

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