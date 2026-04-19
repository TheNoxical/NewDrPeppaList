import React from 'react';
import TopBar from './components/TopBar.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from './components/useAuth.js';
import { BrowserRouter } from 'react-router-dom';
import AppContent from './AppContent.jsx';


function App() {

  return (
    <div className="app">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  )
}

export default App
