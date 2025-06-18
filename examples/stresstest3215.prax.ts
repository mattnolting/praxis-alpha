/**
 * StressTest3215 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3215",
    "description": "Stress test component 3215 with medium configuration",
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