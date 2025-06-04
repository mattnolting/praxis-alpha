/**
 * Core schema for .praxis.ts configuration files
 * Defines the structure for component prop definitions
 */

export interface PraxisConfig {
  component: string;
  props: Record<string, PropDefinition>;
  meta?: {
    description?: string;
    version?: string;
    dependencies?: string[];
  };
}

export interface PropDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';
  required?: boolean;
  default?: any;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

export interface GeneratedProps {
  [key: string]: PropDefinition;
}
