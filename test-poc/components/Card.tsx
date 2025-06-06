import React from 'react';

// Manual interface - more prop duplication across components
interface CardProps {
  variant?: 'primary' | 'secondary' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  isClickable?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'primary',
  size = 'md',
  elevation = 'md',
  isClickable = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  const baseClass = 'card';
  const variantClass = `card-${variant}`;
  const sizeClass = `card-${size}`;
  const elevationClass = `card-elevation-${elevation}`;
  const clickableClass = isClickable ? 'card-clickable' : '';
  
  const finalClassName = [baseClass, variantClass, sizeClass, elevationClass, clickableClass, className]
    .filter(Boolean)
    .join(' ');

  const handleClick = isClickable && onClick ? onClick : undefined;

  return (
    <div 
      className={finalClassName} 
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
