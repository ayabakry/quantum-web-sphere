
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="relative">
        <div className={`font-bold ${sizeClasses[size]} text-quantum-purple flex items-center`}>
          <span>Q</span>
          <div className="animate-quantum-pulse w-6 h-6 rounded-full bg-quantum-purple/20 absolute -right-1 -top-1" />
          <span>RAM</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
