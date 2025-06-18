/**
 * StressTest3003 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3003",
    "description": "Stress test component 3003 with medium configuration",
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