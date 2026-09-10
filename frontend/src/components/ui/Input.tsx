import React from 'react';

type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
};

export const Input: React.FC<InputProps> = ({ 
  label, 
  placeholder, 
  type = 'text', 
  name,
  value, 
  onChange, 
  error, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-brand-blue-dark">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 py-2 border rounded-lg outline-none transition-all 
          ${error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue'}
          bg-white text-brand-blue-dark`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
