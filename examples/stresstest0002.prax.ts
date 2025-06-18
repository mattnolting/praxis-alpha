/**
 * StressTest0002 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest0002",
    "description": "Stress test component 2 with simple configuration",
    "category": "feedback"
  },
  "uses": {
    "variants": [
      "success",
      "warning"
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