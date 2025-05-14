import { Image as ImageIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import logoo from './logo.png'; 

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
          {logoo ? (
            <img src={logoo} alt="logo" className="h-40"/>
          ) : (
            <ImageIcon className="h-8 w-8" />
          )}
        </div>
      </div>
    </Link>
  );
};

export default Logo;