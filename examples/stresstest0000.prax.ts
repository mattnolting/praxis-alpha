/**
 * StressTest0000 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest0000",
    "description": "Stress test component 0 with simple configuration",
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