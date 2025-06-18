/**
 * StressTest1002 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest1002",
    "description": "Stress test component 1002 with simple configuration",
    "category": "feedback"
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