/**
 * StressTest0090 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest0090",
    "description": "Stress test component 90 with simple configuration",
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