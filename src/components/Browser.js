// Browser.js
import React, { useState, useEffect } from 'react';
import Stack from '../utils/Stack';
import StackVisualization from './StackVisualization';
import Navigation from './Navigation';
import PageContent from './PageContent';
import { useSlideAnimation, useBounceAnimation } from '../hooks/useAnimation';
import './Browser.css';

const KNOWN_PAGES = ['Home', 'About', 'Products', 'Contact', 'Settings', 'Help'];

const Browser = () => {
  const [backStack, setBackStack] = useState(new Stack());
  const [forwardStack, setForwardStack] = useState(new Stack());
  const [currentPage, setCurrentPage] = useState('Home');
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState(['Home']);
  const [theme, setTheme] = useState('light');

  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { 
    isAnimating: isPageAnimating, 
    triggerAnimation: triggerPageAnimation, 
    animationClass: pageAnimationClass 
  } = useSlideAnimation();

  const { 
    triggerBounce, 
    bounceClass: inputBounceClass 
  } = useBounceAnimation();

  // Validate a navigation target.
  // Returns true if the "URL/page" is considered valid (exists or is known).
  // Handles:
  //  - internal page names (quick accept)
  //  - external URLs: tries HEAD fetch with timeout then falls back to an Image ping.
  const validateTarget = async (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return false;

    // If the user typed a known internal page name (e.g., "About"), accept immediately
    const normalizedCapitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (KNOWN_PAGES.includes(normalizedCapitalized)) {
      return true;
    }

    // For external-like targets, try to ensure there's actually something there.
    // Normalize to an https:// prefixed URL for checks.
    let testUrl = trimmed;
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = `https://${testUrl}`;
    }

    // Try HEAD with timeout
    const controller = new AbortController();
    const timeoutMs = 3000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(testUrl, { method: 'HEAD', mode: 'cors', signal: controller.signal });
      clearTimeout(timer);
      // If we can get a response and it's OK (<400), consider valid.
      return res.ok;
    } catch (err) {
      clearTimeout(timer);
      // Network / DNS errors (or CORS/head blocked) -> fallback to image ping
      return await new Promise((resolve) => {
        const img = new Image();
        // add cache-buster
        img.src = `${testUrl.replace(/\/$/, '')}/favicon.ico?cache=${Date.now()}`;
        const fallbackTimer = setTimeout(() => {
          // assume failure after timeout
          img.onload = img.onerror = null;
          resolve(false);
        }, timeoutMs);

        img.onload = () => {
          clearTimeout(fallbackTimer);
          resolve(true);
        };
        img.onerror = () => {
          clearTimeout(fallbackTimer);
          resolve(false);
        };
      });
    }
  };

  // navigateTo will first validate; only on success we push currentPage to backStack etc.
  const navigateTo = async (url) => {
    if (url.trim() === '' || url === currentPage) {
      triggerBounce();
      return;
    }

    // Prevent multiple parallel checks / navigation attempts
    if (isChecking) return;
    setIsChecking(true);
    setErrorMessage('');

    const ok = await validateTarget(url);
    setIsChecking(false);

    if (!ok) {
      setErrorMessage('Invalid URL — page not found or network error.');
      triggerBounce();
      return; // IMPORTANT: do not push current page onto back stack
    }

    // Proceed with normal navigation (we now know the target is valid)
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
      // if it's one of the known internal pages, normalize capitalization
      const normalized = (url && KNOWN_PAGES.includes(url.charAt(0).toUpperCase() + url.slice(1)))
        ? (url.charAt(0).toUpperCase() + url.slice(1))
        : url;
      setCurrentPage(normalized);
      setHistory(prev => [...prev, normalized]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await navigateTo(inputUrl);
  };

  const clearHistory = () => {
    setBackStack(new Stack());
    setForwardStack(new Stack());
    setHistory(['Home']);
    setCurrentPage('Home');
    setErrorMessage('');
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
              onChange={(e) => { setInputUrl(e.target.value); setErrorMessage(''); }}
              placeholder="Enter page name (e.g., About, Products) or domain (example.com)"
              className="url-input"
              disabled={isChecking}
            />
            <button type="submit" className="go-button" disabled={isChecking}>
              {isChecking ? 'Checking…' : (
                <>
                  <span>Navigate</span>
                  <span className="button-icon">→</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="nav-error">
            <span>{errorMessage}</span>
            <button className="dismiss-btn" onClick={() => setErrorMessage('')}>✕</button>
          </div>
        )}

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
