import React from 'react';

// Manual interface - notice prop duplication with Button
interface AlertProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isClosable?: boolean;
  onClose?: () => void;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  size = 'md',
  isClosable = false,
  onClose,
  title,
  className = '',
  children,
  ...props
}) => {
  const baseClass = 'alert';
  const variantClass = `alert-${variant}`;
  const sizeClass = `alert-${size}`;
  
  const finalClassName = [baseClass, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={finalClassName} {...props}>
      {title && <div className="alert-title">{title}</div>}
      <div className="alert-content">{children}</div>
      {isClosable && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
