import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <svg 
        className={sizeClasses[size]} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Círculo del escudo */}
        <circle cx="32" cy="32" r="30" fill="#1f2937" stroke="#3b82f6" strokeWidth="4"/>
        
        {/* Gorro de graduación */}
        <path d="M20 24 L44 24 L42 20 L22 20 Z" fill="#3b82f6"/>
        <path d="M22 20 L42 20 L40 16 L24 16 Z" fill="#3b82f6"/>
        
        {/* Borla del gorro */}
        <circle cx="44" cy="22" r="2" fill="#3b82f6"/>
        <line x1="44" y1="24" x2="44" y2="28" stroke="#3b82f6" strokeWidth="2"/>
        
        {/* Letra F */}
        <path d="M28 36 L28 50 L30 50 L30 38 L36 38 L36 36 L28 36 Z" fill="white"/>
        <path d="M28 36 L36 36 L36 34 L28 34 Z" fill="white"/>
      </svg>
      <span className="text-xl font-bold text-primary">FocusU</span>
    </div>
  );
};

export default Logo;
