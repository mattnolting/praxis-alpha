/**
 * StressTest3262 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3262",
    "description": "Stress test component 3262 with medium configuration",
    "category": "media"
  },
  "uses": {
    "variants": [
      "small",
      "medium",
      "large"
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