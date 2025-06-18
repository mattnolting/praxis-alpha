/**
 * StressTest1415 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest1415",
    "description": "Stress test component 1415 with simple configuration",
    "category": "overlay"
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