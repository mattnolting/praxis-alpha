/**
 * StressTest1200 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest1200",
    "description": "Stress test component 1200 with simple configuration",
    "category": "input"
  },
  "uses": {
    "variants": [
      "primary",
      "secondary"
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