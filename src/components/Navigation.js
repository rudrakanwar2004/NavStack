import React from 'react';
import { useBounceAnimation } from '../hooks/useAnimation';
import './Navigation.css';

const Navigation = ({ goBack, goForward, canGoBack, canGoForward, currentPage }) => {
  const { bounceClass: backBounceClass, triggerBounce: triggerBackBounce } = useBounceAnimation();
  const { bounceClass: forwardBounceClass, triggerBounce: triggerForwardBounce } = useBounceAnimation();

  const handleBackClick = () => {
    if (canGoBack) {
      goBack();
    } else {
      triggerBackBounce();
    }
  };

  const handleForwardClick = () => {
    if (canGoForward) {
      goForward();
    } else {
      triggerForwardBounce();
    }
  };

  return (
    <div className="navigation">
      <div className="nav-section">
        <button 
          onClick={handleBackClick}
          disabled={!canGoBack}
          className={`nav-button back-button ${backBounceClass} ${!canGoBack ? 'disabled' : ''}`}
          aria-label="Go back"
        >
          <span className="button-content">
            <span className="nav-icon">←</span>
            <span className="nav-text">Back</span>
          </span>
        </button>
        
        <button 
          onClick={handleForwardClick}
          disabled={!canGoForward}
          className={`nav-button forward-button ${forwardBounceClass} ${!canGoForward ? 'disabled' : ''}`}
          aria-label="Go forward"
        >
          <span className="button-content">
            <span className="nav-text">Forward</span>
            <span className="nav-icon">→</span>
          </span>
        </button>
      </div>
      
      <div className="current-page-indicator">
        <div className="page-indicator">
          <span className="indicator-label">Current :- </span>
          <span className="indicator-page">{currentPage}</span>
        </div>
      </div>
    </div>
  );
};

export default Navigation;