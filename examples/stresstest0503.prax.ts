/**
 * StressTest0503 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest0503",
    "description": "Stress test component 503 with simple configuration",
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