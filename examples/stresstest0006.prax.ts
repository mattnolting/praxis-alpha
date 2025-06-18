/**
 * StressTest0006 - Stress test component
 * Complexity: Simple
 */
export default {
  "component": {
    "name": "StressTest0006",
    "description": "Stress test component 6 with simple configuration",
    "category": "media"
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