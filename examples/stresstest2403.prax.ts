/**
 * StressTest2403 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2403",
    "description": "Stress test component 2403 with medium configuration",
    "category": "navigation"
  },
  "uses": {
    "variants": [
      "light",
      "dark",
      "auto"
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