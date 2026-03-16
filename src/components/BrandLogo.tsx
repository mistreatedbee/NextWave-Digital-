import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  showText?: boolean;
  className?: string;
}

export function BrandLogo({ showText = true, className = '' }: BrandLogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <img
        src="/logo.png"
        alt="NextWave Digital Solutions logo"
        className="h-8 w-auto object-contain"
      />
      {showText && (
        <span className="text-xl font-bold text-white tracking-tight">
          NextWave <span className="text-gradient">Digital</span>
        </span>
      )}
    </Link>
  );
}

