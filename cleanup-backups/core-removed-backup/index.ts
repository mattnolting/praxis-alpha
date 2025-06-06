/**
 * Praxis Alpha - Main Entry Point
 * Aggregates all package exports for a unified API
 */

// Re-export everything from the packages using relative imports
export * from '../packages/cascade/index';
export * from '../packages/generate/index';
export * from '../packages/props/schemas';

// Plugin export
export { praxisPlugin } from '../packages/props/plugin';

// Default export for convenience
const praxis = {
  // Core functionality will be imported here when packages are implemented
  version: '0.1.0-alpha'
};

export default praxis;
