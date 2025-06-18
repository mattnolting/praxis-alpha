/**
 * StressTest1991 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest1991",
    "description": "Stress test component 1991 with medium configuration",
    "category": "overlay"
  },
  "uses": {
    "variants": [
      "subtle",
      "bold",
      "minimal"
    ],
    "sizes": [
      "compact",
      "comfortable",
      "spacious"
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