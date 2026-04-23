import React, { useState } from 'react';

interface HeaderProps {
  onThemeToggle: () => void;
  theme: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({ onThemeToggle, theme }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">DistroViz</h1>
          <p className="text-blue-200 text-sm">Distribution Visualization Dashboard</p>
        </div>
        <button
          onClick={onThemeToggle}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
};