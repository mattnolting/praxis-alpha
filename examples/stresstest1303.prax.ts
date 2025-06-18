/**
 * StressTest1303 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest1303",
    "description": "Stress test component 1303 with simple configuration",
    "category": "overlay"
  },
  "uses": {
    "variants": [
      "default",
      "outlined"
    ]
  },
  "output": {
    "json": true,
    "typescript": true,
    "schema": true,
    "figma": true,
    "storybook": true
  }
} as const