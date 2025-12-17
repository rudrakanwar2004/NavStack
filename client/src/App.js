// App.js
import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import Browser from './components/Browser';
import './App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleStart = () => {
    setShowWelcome(false);
  };

  return (
    <div className={`App theme-${theme}`}>
      {showWelcome ? (
        <WelcomePage 
          onStart={handleStart} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      ) : (
        <Browser 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

export default App;