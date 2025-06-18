/**
 * StressTest2223 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2223",
    "description": "Stress test component 2223 with medium configuration",
    "category": "overlay"
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