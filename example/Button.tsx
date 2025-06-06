import React from 'react';
import type { TestButtonProps } from '../types/TestButtonProps';

/**
 * Example React component using generated Praxis types
 * 
 * This demonstrates:
 * - Zero-config type generation from TestButton.praxis.yaml
 * - Perfect TypeScript integration
 * - All props auto-generated and maintained
 * - Consistent prop naming across components
 */
export const TestButton: React.FC<TestButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isDisabled = false,
  isLoading = false,
  isSelected = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  onClick,
  onHover,
  className = '',
  style,
  children,
  ...props
}) => {
  // Compute CSS classes based on props
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    isDisabled && 'btn-disabled',
    isLoading && 'btn-loading', 
    isSelected && 'btn-selected',
    className
  ].filter(Boolean).join(' ');

  // Handle click events
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled || isLoading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  // Handle hover events
  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
      onHover?.(event);
    }
  };

  return (
    <button
      type="button"
      className={classes}
      style={style}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={isSelected}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
};

/**
 * Example usage:
 * 
 * <TestButton 
 *   variant="primary"      // ✅ Typed: "primary" | "secondary" | "tertiary" | "danger"
 *   size="lg"              // ✅ Typed: "xs" | "sm" | "md" | "lg" | "xl"
 *   isLoading={true}       // ✅ Typed: boolean
 *   onClick={handleClick}  // ✅ Typed: (...args: any[]) => any
 *   aria-label="Save"      // ✅ Typed: string
 * >
 *   Save Changes
 * </TestButton>
 * 
 * Benefits:
 * ✅ Perfect TypeScript autocomplete
 * ✅ Compile-time error checking
 * ✅ Consistent props across all components
 * ✅ Automatic updates when YAML changes
 * ✅ Zero maintenance overhead
 */

export default TestButton;