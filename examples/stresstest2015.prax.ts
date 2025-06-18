/**
 * StressTest2015 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2015",
    "description": "Stress test component 2015 with medium configuration",
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