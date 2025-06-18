/**
 * StressTest0003 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest0003",
    "description": "Stress test component 3 with simple configuration",
    "category": "navigation"
  },
  "uses": {
    "variants": [
      "light",
      "dark"
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