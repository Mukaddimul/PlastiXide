import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", title }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className}`}>
      {title && <h3 className="font-heading font-semibold text-lg mb-4 text-brand-dark">{title}</h3>}
      {children}
    </div>
  );
};