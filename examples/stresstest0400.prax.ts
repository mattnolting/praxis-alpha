/**
 * StressTest0400 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest0400",
    "description": "Stress test component 400 with simple configuration",
    "category": "input"
  },
  "uses": {
    "variants": [
      "small",
      "medium"
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