import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  showText?: boolean;
  className?: string;
}

export function BrandLogo({ showText = true, className = '' }: BrandLogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      <img
        src="/logo.jpeg"
        alt="NextWave Digital Solutions"
        className="h-9 w-auto object-contain"
      />
      {showText && (
        <span className="font-sans text-sm font-medium tracking-[0.12em] uppercase text-cream/80 group-hover:text-cream transition-colors duration-400">
          NextWave <span className="text-gold">Digital</span>
        </span>
      )}
    </Link>
  );
}
