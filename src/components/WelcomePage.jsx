import React, { useEffect, useState } from 'react';
import './WelcomePage.css';
import logo from '../styles/logo_final.png';
const TEAM = [
  'Rudra Kanwar',
  'Sohail Khan',
  'Ragini Kanojia',
  'Ambarish Maji'
];

const WelcomePage = ({ onStart, theme, toggleTheme }) => {
  const [step, setStep] = useState(0);
  const [buttonBumped, setButtonBumped] = useState(false);

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setStep(1), 100));
    timers.push(setTimeout(() => setStep(2), 900));
    timers.push(setTimeout(() => setStep(3), 1600));
    timers.push(setTimeout(() => setStep(4), 2400));

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const handleStart = () => {
    setButtonBumped(true);
    setTimeout(() => {
      setButtonBumped(false);
      if (typeof onStart === 'function') onStart();
    }, 350);
  };

  return (
    <main className="welcome-page" role="main">
      {/* Theme Toggle Button */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="welcome-card">
        <div className="logo-wrap" aria-hidden={step < 1}>
          <img
            src={logo}
            alt="NavStack logo"
            className={`logo ${step >= 1 ? 'fade-in' : ''}`}
            draggable={false}
          />
        </div>

        <h1
          className={`welcome-title ${step >= 2 ? 'slide-right' : ''}`}
          aria-hidden={step < 2}
        >
          NavStack — A Browser History Simulator
        </h1>

        <section className="team-section" aria-hidden={step < 3}>
          <h2 className={`team-heading ${step >= 3 ? 'fade-in' : ''}`}>
            Meet the team
          </h2>
          <ul className="team-list">
            {TEAM.map((member, i) => {
              const visible = step >= 3;
              const delayMs = 300 + i * 120;
              return (
                <li
                  key={member}
                  className={`team-item ${visible ? 'stack-item' : ''}`}
                  style={{
                    animationName: visible ? 'stackItemAppear' : 'none',
                    animationDuration: visible ? '450ms' : undefined,
                    animationFillMode: 'both',
                    animationDelay: visible ? `${delayMs}ms` : undefined
                  }}
                >
                  <span className="bullet">•</span>
                  <span className="member-name">{member}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="start-btn-wrap" aria-hidden={step < 4}>
          <button
            className={`get-started ${step >= 4 ? 'pulse' : ''} ${buttonBumped ? 'bounce' : ''}`}
            onClick={handleStart}
            disabled={step < 4}
            aria-disabled={step < 4}
          >
            Get Started
            <span className="chev">→</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default WelcomePage;