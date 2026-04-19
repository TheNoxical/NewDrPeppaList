import React from 'react';
import TopBar from './components/TopBar.jsx';
import { useAuth } from './components/useAuth.js';

function AppContent() {
    useAuth();

    return (
        <div>
            <TopBar />
        </div>
    );
}

export default AppContent;