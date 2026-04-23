import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800',
  };

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg border-l-4 shadow-lg ${bgColors[type]} z-50`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold hover:opacity-70">
          ×
        </button>
      </div>
    </div>
  );
};