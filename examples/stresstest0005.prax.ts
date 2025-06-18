/**
 * StressTest0005 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest0005",
    "description": "Stress test component 5 with simple configuration",
    "category": "data"
  },
  "uses": {
    "variants": [
      "subtle",
      "bold"
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