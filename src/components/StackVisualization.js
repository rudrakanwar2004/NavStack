import React, { useState, useEffect } from 'react';
import { usePulseAnimation } from '../hooks/useAnimation';
import './StackVisualization.css';

const StackVisualization = ({ stack, title, stackType, currentPage }) => {
  const [previousSize, setPreviousSize] = useState(0);
  const stackArray = stack.toArray ? stack.toArray() : [];
  const isEmpty = stackArray.length === 0;
  const { pulseClass, triggerPulse } = usePulseAnimation();

  useEffect(() => {
    if (stackArray.length !== previousSize) {
      triggerPulse();
      setPreviousSize(stackArray.length);
    }
  }, [stackArray.length, previousSize, triggerPulse]);

  return (
    <div className={`stack-visualization ${stackType}-stack ${pulseClass}`}>
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
                className={`stack-item ${index === stackArray.length - 1 ? 'top' : ''} ${
                  item === currentPage ? 'current' : ''
                }`}
                style={{ 
                  animationDelay: `${(stackArray.length - index - 1) * 0.1}s`,
                  zIndex: stackArray.length - index
                }}
              >
                <div className="stack-item-content">
                  <span className="item-index">{stackArray.length - index}</span>
                  <span className="item-name">{item}</span>
                </div>
                {index === stackArray.length - 1 && (
                  <div className="top-indicator">TOP</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="stack-footer">
        <div className="stack-operations">
          <span className="operation push">PUSH</span>
          <span className="operation pop">POP</span>
        </div>
      </div>
    </div>
  );
};

export default StackVisualization;