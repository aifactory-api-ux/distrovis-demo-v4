import React, { useState } from 'react';

interface Props {
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

export function Header({ onToggleTheme, theme }: Props) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>Distrovis</h1>
          <p>Dashboard de Pedidos</p>
        </div>
        <button onClick={onToggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}