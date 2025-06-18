/**
 * StressTest1793 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest1793",
    "description": "Stress test component 1793 with medium configuration",
    "category": "display"
  },
  "uses": {
    "variants": [
      "subtle",
      "bold",
      "minimal"
    ],
    "sizes": [
      "tiny",
      "small",
      "medium",
      "large"
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