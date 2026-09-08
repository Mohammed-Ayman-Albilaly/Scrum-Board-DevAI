import React from 'react';

type CardProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-brand-neutral-card border border-slate-200 rounded-xl shadow-sm p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-brand-blue-dark mb-4">{title}</h3>}
      {children}
    </div>
  );
};
