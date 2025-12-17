import React, { useState, useEffect } from 'react';
import Stack from '../utils/Stack';
import StackVisualization from './StackVisualization';
import Navigation from './Navigation';
import PageContent from './PageContent';
import { useSlideAnimation, useBounceAnimation } from '../hooks/useAnimation';
import './Browser.css';

/**
 * Browser component
 * -----------------
 * A simple SPA-like browser simulator that supports navigation between
 * internal "pages" and external URLs. Uses two stack data structures
 * (backStack and forwardStack) to emulate browser back/forward behavior.
 *
 * This file has been annotated with user-facing comments for each function
 * and important variables. The implementation logic is unchanged — only
 * comments were added to explain behavior and intent.
 */

// Known internal pages — used to detect internal navigation vs external URLs.
const KNOWN_PAGES = ['Home', 'About', 'Products', 'Contact', 'Settings', 'Help'];

/**
 * normalizeUrl(url: string) => string
 * ----------------------------------
 * Normalizes a user-entered URL or page name for comparison and storage.
 * - Trims whitespace.
 * - If the input matches a known internal page (case-insensitive start),
 *   returns the canonical page name (capitalized).
 * - For external URLs, ensures the scheme (https://) is present and removes
 *   any trailing slash for consistent comparison.
 */
const normalizeUrl = (url) => {
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Check if it's a known internal page
  const normalizedCapitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (KNOWN_PAGES.includes(normalizedCapitalized)) {
    return normalizedCapitalized;
  }

  // For external URLs, normalize by adding https:// and removing trailing slashes
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  return normalized.replace(/\/$/, '');
};

/**
 * isUrlInStack(url: string, stack: Stack) => boolean
 * --------------------------------------------------
 * Utility that checks whether a given URL (or page name) already exists in
 * the provided stack. It normalizes both the target and each stack item to
 * make comparisons robust (ignores trailing slash / missing scheme differences).
 */
const isUrlInStack = (url, stack) => {
  const normalizedTarget = normalizeUrl(url);
  const stackArray = stack.toArray();

  return stackArray.some(stackItem => {
    const normalizedStackItem = normalizeUrl(stackItem);
    return normalizedStackItem === normalizedTarget;
  });
};

/**
 * Browser component (React)
 * -------------------------
 * parameters or props:
 *  - theme: initial theme string ('light'|'dark')
 *  - toggleTheme: optional parent-provided function to toggle theme (if passed,
 *                 component uses parent theme control)
 *
 * State & important variables (brief):
 *  - backStack / forwardStack: Stack instances used to store navigation history.
 *  - currentPage: currently visible page (internal page name or external URL).
 *  - inputUrl: the text the user typed into the address bar.
 *  - history: simple array of visited pages for debugging/visualization.
 *  - theme: either controlled by parent (via toggleTheme) or local state.
 *  - isChecking: boolean that prevents concurrent URL validation calls.
 *  - errorMessage: UI-friendly error text to show navigation problems.
 *
 * Animation hooks are used to add slide/bounce classes when navigating or when
 * user input requires attention.
 */
const Browser = ({ theme: initialTheme = 'light', toggleTheme: parentToggleTheme }) => {
  // Browser history stacks (LIFO) — wrap plain arrays in Stack utility
  const [backStack, setBackStack] = useState(new Stack());
  const [forwardStack, setForwardStack] = useState(new Stack());

  // Current visible page (starts at 'Home') and the raw input field string
  const [currentPage, setCurrentPage] = useState('Home');
  const [inputUrl, setInputUrl] = useState('');

  // Simple visiting history for UI / debugging purposes
  const [history, setHistory] = useState(['Home']);

  // Theme handling: if parent provides toggleTheme, component defers to parent
  const [localTheme, setLocalTheme] = useState(initialTheme);
  const theme = parentToggleTheme ? initialTheme : localTheme;

  // Async validation control + error message shown to user
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Slide animation hook for page transitions
  const { 
    isAnimating: isPageAnimating, 
    triggerAnimation: triggerPageAnimation, 
    animationClass: pageAnimationClass 
  } = useSlideAnimation();

  // Bounce animation hook for input focus/invalid feedback
  const { 
    triggerBounce, 
    bounceClass: inputBounceClass 
  } = useBounceAnimation();

  /**
   * handleToggleTheme()
   * --------------------
   * Toggles the theme. If a parent toggle function was provided, delegate to it;
   * otherwise, flip localTheme state.
   */
  const handleToggleTheme = () => {
    if (parentToggleTheme) {
      parentToggleTheme();
    } else {
      setLocalTheme(prev => prev === 'light' ? 'dark' : 'light');
    }
  };

  /**
   * validateTarget(raw: string) => Promise<boolean>
   * -----------------------------------------------
   * Validates whether the provided input is a valid navigation target.
   * - Immediately accepts known internal pages.
   * - Otherwise posts the raw value to a backend endpoint '/api/validate-url'
   *   which should return { valid: true } for reachable/existing URLs.
   * - Returns false when the server call fails or returns invalid.
   *
   * Please note that isChecking state in the component protects against duplicate
   * validation requests triggered in rapid succession.
   */
  
  const validateTarget = async (raw) => {
    const trimmed = (raw || '').trim();
    if (!trimmed) return false;

    const normalizedCapitalized =
      trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (KNOWN_PAGES.includes(normalizedCapitalized)) {
      return true;
    }

    // Do quick client-side format validation before hitting the server
    let candidate = trimmed;
    if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;

    try {
      // validate URL syntax locally (avoids unnecessary server calls)
      new URL(candidate);
    } catch {
      // invalid URL format -> reject immediately
      return false;
    }

    try {
      const res = await fetch('/api/validate-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      return data && data.valid === true;
    } catch {
      // If server call fails, treat as invalid (safer than accepting)
      return false;
    }
  };


  /**
   * navigateTo(url: string) => Promise<void>
   * ----------------------------------------
   * Main navigation routine invoked when the user submits an address.
   * Responsibilities:
   *  - basic input validation (empty, duplicate/current page, already-in-backstack)
   *  - call validateTarget to confirm the target exists
   *  - push the current page onto the backStack
   *  - clear forwardStack (new navigation invalidates forward history)
   *  - trigger page animation then update the current page
   *
   * Important: this function uses Stack.clone-like behavior by creating new
   * Stack instances when updating state — that keeps React state immutable
   * (i.e., replacing the stacks rather than mutating shared references).
   */
  const navigateTo = async (url) => {
    if (url.trim() === '') {
      triggerBounce();
      return;
    }

    // Prevent navigating to the same normalized page/URL
    const normalizedCurrent = normalizeUrl(currentPage);
    const normalizedTarget = normalizeUrl(url);

    if (normalizedTarget === normalizedCurrent) {
      triggerBounce();
      setErrorMessage('Already on this page');
      return;
    }

    // Prevent duplicate entries in the back stack
    if (isUrlInStack(url, backStack)) {
      triggerBounce();
      setErrorMessage('This page is already in your history');
      return;
    }

    if (isChecking) return; // avoid concurrent validation calls
    setIsChecking(true);
    setErrorMessage('');

    const ok = await validateTarget(url);
    setIsChecking(false);

    if (!ok) {
      setErrorMessage('Invalid URL — page not found or network error.');
      triggerBounce();
      return;
    }

    // Push current page onto back stack (if any), using a fresh Stack instance
    if (currentPage) {
      const newBackStack = new Stack();
      backStack.toArray().forEach(item => newBackStack.push(item));
      newBackStack.push(currentPage);
      setBackStack(newBackStack);
    }

    // Clear forward stack because we are branching into a new navigation path
    const newForwardStack = new Stack();
    setForwardStack(newForwardStack);

    // Trigger the page slide animation and then update current page after delay
    triggerPageAnimation();

    setTimeout(() => {
      const normalized = (url && KNOWN_PAGES.includes(url.charAt(0).toUpperCase() + url.slice(1)))
        ? (url.charAt(0).toUpperCase() + url.slice(1))
        : url;
      setCurrentPage(normalized);
      setHistory(prev => [...prev, normalized]);
    }, 150);

    // Reset the address bar input after successful navigation
    setInputUrl('');
  };

  /**
   * goBack()
   * --------
   * Simulates the browser "Back" button:
   *  - Moves currentPage into the forwardStack
   *  - Pops the last item from backStack and sets it as currentPage
   *  - Preserves immutability by creating new Stack instances for state
   */
  const goBack = () => {
    if (backStack.isEmpty()) return;

    if (currentPage) {
      const newForwardStack = new Stack();
      forwardStack.toArray().forEach(item => newForwardStack.push(item));
      newForwardStack.push(currentPage);
      setForwardStack(newForwardStack);
    }

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

  /**
   * goForward()
   * -----------
   * Simulates the browser "Forward" button:
   *  - Pushes the current page onto the backStack
   *  - Pops the next page from forwardStack and navigates to it
   */
  const goForward = () => {
    if (forwardStack.isEmpty()) return;

    if (currentPage) {
      const newBackStack = new Stack();
      backStack.toArray().forEach(item => newBackStack.push(item));
      newBackStack.push(currentPage);
      setBackStack(newBackStack);
    }

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

  /**
   * handleSubmit(e)
   * ----------------
   * Form submit handler for the address bar — prevents default and delegates
   * to navigateTo with the current inputUrl value.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await navigateTo(inputUrl);
  };

  /**
   * quickNavigate(page: string)
   * ---------------------------
   * Convenience method used by UI elements to quickly navigate to a known
   * page. Sets input field and triggers navigation — navigation routine will
   * still perform validation and duplicate checks.
   */
  const quickNavigate = (page) => {
    setInputUrl(page);
    navigateTo(page);
  };

  /**
   * clearHistory()
   * ----------------
   * Resets back/forward stacks, resets history tracker and navigates back to
   * the Home page. Clears any visible error messages too.
   */
  const clearHistory = () => {
    setBackStack(new Stack());
    setForwardStack(new Stack());
    setHistory(['Home']);
    setCurrentPage('Home');
    setErrorMessage('');
  };

  // Apply selected theme to the document body so CSS can respond to .theme-* classes
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
            onClick={handleToggleTheme}
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

        <div className="quick-links">
          <p className="quick-links-label">Quick Navigation:</p>
          <div className="quick-links-buttons">
            {KNOWN_PAGES.map(page => (
              <button 
                key={page}
                onClick={() => quickNavigate(page)}
                className={`quick-link ${currentPage === page ? 'active' : ''}`}
                disabled={currentPage === page || isUrlInStack(page, backStack)}
                title={isUrlInStack(page, backStack) ? "Already in history" : ""}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

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