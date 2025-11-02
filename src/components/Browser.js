import React, { useState, useEffect } from 'react';
import Stack from '../utils/Stack';
import StackVisualization from './StackVisualization';
import Navigation from './Navigation';
import PageContent from './PageContent';
import { useSlideAnimation, useBounceAnimation } from '../hooks/useAnimation';
import './Browser.css';

const Browser = () => {
  const [backStack, setBackStack] = useState(new Stack());
  const [forwardStack, setForwardStack] = useState(new Stack());
  const [currentPage, setCurrentPage] = useState('Home');
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState(['Home']);
  const [theme, setTheme] = useState('light');

  const { 
    isAnimating: isPageAnimating, 
    triggerAnimation: triggerPageAnimation, 
    animationClass: pageAnimationClass 
  } = useSlideAnimation();

  const { 
    triggerBounce, 
    bounceClass: inputBounceClass 
  } = useBounceAnimation();

  const navigateTo = (url) => {
    if (url.trim() === '' || url === currentPage) {
      triggerBounce();
      return;
    }
    
    // Push current page to back stack
    if (currentPage) {
      const newBackStack = new Stack();
      backStack.toArray().forEach(item => newBackStack.push(item));
      newBackStack.push(currentPage);
      setBackStack(newBackStack);
    }
    
    // Clear forward stack when navigating to a new page
    const newForwardStack = new Stack();
    setForwardStack(newForwardStack);
    
    // Trigger page animation
    triggerPageAnimation();
    
    // Set new current page and update history
    setTimeout(() => {
      setCurrentPage(url);
      setHistory(prev => [...prev, url]);
    }, 150);
    
    setInputUrl('');
  };

  const goBack = () => {
    if (backStack.isEmpty()) return;
    
    // Push current page to forward stack
    if (currentPage) {
      const newForwardStack = new Stack();
      forwardStack.toArray().forEach(item => newForwardStack.push(item));
      newForwardStack.push(currentPage);
      setForwardStack(newForwardStack);
    }
    
    // Pop from back stack to set new current page
    const previousPage = backStack.pop();
    const newBackStack = new Stack();
    backStack.toArray().forEach(item => newBackStack.push(item));
    setBackStack(newBackStack);
    
    triggerPageAnimation();
    setTimeout(() => {
      setCurrentPage(previousPage);
      setHistory(prev => [...prev, previousPage]);
    }, 150);
  };

  const goForward = () => {
    if (forwardStack.isEmpty()) return;
    
    // Push current page to back stack
    if (currentPage) {
      const newBackStack = new Stack();
      backStack.toArray().forEach(item => newBackStack.push(item));
      newBackStack.push(currentPage);
      setBackStack(newBackStack);
    }
    
    // Pop from forward stack to set new current page
    const nextPage = forwardStack.pop();
    const newForwardStack = new Stack();
    forwardStack.toArray().forEach(item => newForwardStack.push(item));
    setForwardStack(newForwardStack);
    
    triggerPageAnimation();
    setTimeout(() => {
      setCurrentPage(nextPage);
      setHistory(prev => [...prev, nextPage]);
    }, 150);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };



  const clearHistory = () => {
    setBackStack(new Stack());
    setForwardStack(new Stack());
    setHistory(['Home']);
    setCurrentPage('Home');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <div className={`browser theme-${theme}`}>
      <div className="browser-header">
        <div className="header-top">
          <h1 className="app-title">
            NavStack - A Browser History Simulator
          </h1>
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        
        <Navigation 
          goBack={goBack}
          goForward={goForward}
          canGoBack={!backStack.isEmpty()}
          canGoForward={!forwardStack.isEmpty()}
          currentPage={currentPage}
        />
        
        <form onSubmit={handleSubmit} className="url-form">
          <div className={`url-input-container ${inputBounceClass}`}>
            <span className="url-prefix">https://</span>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter page name (e.g., About, Products)"
              className="url-input"
            />
            <button type="submit" className="go-button">
              <span>Navigate</span>
              <span className="button-icon">→</span>
            </button>
          </div>
        </form>
        


        <div className="history-controls">
          <button 
            onClick={clearHistory}
            className="clear-history-btn"
            disabled={backStack.isEmpty() && forwardStack.isEmpty()}
          >
            🗑️ Clear History
          </button>
          <span className="history-count">
            Pages visited: {history.length}
          </span>
        </div>
      </div>
      
      <div className="browser-content">
        <div className={`current-page-container ${pageAnimationClass}`}>
          <PageContent 
            page={currentPage} 
            history={history}
            isAnimating={isPageAnimating}
          />
        </div>
        
        <div className="stacks-container">
          <StackVisualization 
            stack={backStack} 
            title="Back Stack" 
            stackType="back"
            currentPage={currentPage}
          />
          <StackVisualization 
            stack={forwardStack} 
            title="Forward Stack" 
            stackType="forward"
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Browser;