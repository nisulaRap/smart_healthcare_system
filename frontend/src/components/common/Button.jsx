import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
