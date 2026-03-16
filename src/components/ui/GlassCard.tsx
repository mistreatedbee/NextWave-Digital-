import React from 'react';
import { motion } from 'framer-motion';
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}
export function GlassCard({
  children,
  className = '',
  hoverEffect = false,
  onClick
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass-panel rounded-2xl p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={
      hoverEffect ?
      {
        y: -5,
        boxShadow: '0 10px 30px -10px rgba(6, 182, 212, 0.2)'
      } :
      {}
      }
      transition={{
        duration: 0.3
      }}
      onClick={onClick}>

      {children}
    </motion.div>);

}