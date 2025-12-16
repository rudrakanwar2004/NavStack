import React, { useState, useEffect } from 'react';
import { usePulseAnimation } from '../hooks/useAnimation';
import './StackVisualization.css';

/*
  StackVisualization
  - Shows a visual representation of a stack (Back or Forward).
  - Props:
    - stack: the Stack instance to visualize (must have toArray()).
    - title: title text to display (e.g., "Back Stack").
    - stackType: 'back' or 'forward' (used for icons and styling).
    - currentPage: the current page name (used to highlight items).
*/
const StackVisualization = ({ stack, title, stackType, currentPage }) => {
  // Store previous stack length so we can play a pulse animation when it changes
  const [previousSize, setPreviousSize] = useState(0);

  // Convert stack to a plain array for rendering (Stack provides toArray())
  const stackArray = stack.toArray ? stack.toArray() : [];
  const isEmpty = stackArray.length === 0;

  // Custom hook that gives us a CSS class to animate when stack changes
  const { pulseClass, triggerPulse } = usePulseAnimation();

  // If the stack size changes, trigger the pulse animation and update previousSize
  useEffect(() => {
    if (stackArray.length !== previousSize) {
      triggerPulse();
      setPreviousSize(stackArray.length);
    }
  }, [stackArray.length, previousSize, triggerPulse]);

  return (
    <div className={`stack-visualization ${stackType}-stack ${pulseClass}`}>
      {/* Header: icon + title + simple stats */}
      <div className="stack-header">
        <h3 className="stack-title">
          <span className={`stack-icon ${stackType}-icon`}>
            {stackType === 'back' ? '↶' : '↷'}
          </span>
          {title}
        </h3>
        <div className="stack-stats">
          <span className="stack-size">Items: {stackArray.length}</span>
        </div>
      </div>

      {/* Body: show items or a friendly 'empty' message */}
      <div className="stack-container">
        {isEmpty ? (
          <div className="stack-empty">
            <div className="empty-icon">📭</div>
            <p>Stack is empty</p>
          </div>
        ) : (
          <div className="stack-items">
            {stackArray.map((item, index) => (
              <div 
                key={`${item}-${index}`}
                // Mark the visual "top" item and highlight the item that equals currentPage
                className={`stack-item ${index === stackArray.length - 1 ? 'top' : ''} ${
                  item === currentPage ? 'current' : ''
                }`}
                // Small staggered animation and zIndex so the items stack visually
                style={{ 
                  animationDelay: `${(stackArray.length - index - 1) * 0.1}s`,
                  zIndex: stackArray.length - index
                }}
              >
                <div className="stack-item-content">
                  {/* Show index from top and the page/name */}
                  <span className="item-index">{stackArray.length - index}</span>
                  <span className="item-name">{item}</span>
                </div>

                {/* Label the top element visually */}
                {index === stackArray.length - 1 && (
                  <div className="top-indicator">TOP</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: static labels showing available stack operations (for teaching) */}
    </div>
  );
};

export default StackVisualization;
