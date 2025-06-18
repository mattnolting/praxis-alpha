/**
 * StressTest3305 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3305",
    "description": "Stress test component 3305 with medium configuration",
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