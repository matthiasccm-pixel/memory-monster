import React from 'react';

const Confetti = () => {
  const pieces = Array.from({ length: 100 }, (_, i) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        left: `${Math.random() * 100}%`,
        top: '-20px',
        width: `${Math.random() * 8 + 6}px`,
        height: `${Math.random() * 8 + 6}px`,
        background: ['#7209b7', '#533483', '#16213e', '#0f3460', '#10b981', '#f59e0b'][Math.floor(Math.random() * 6)],
        animation: `confetti 3s ease-out forwards`,
        animationDelay: `${Math.random() * 0.5}s`,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        transform: `rotate(${Math.random() * 360}deg)`
      }}
    />
  ));
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
      {pieces}
    </div>
  );
};

export default Confetti;