/**
 * StressTest2262 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2262",
    "description": "Stress test component 2262 with medium configuration",
    "category": "media"
  },
  "uses": {
    "variants": [
      "primary",
      "secondary",
      "tertiary"
    ],
    "sizes": [
      "12",
      "16",
      "20",
      "24"
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