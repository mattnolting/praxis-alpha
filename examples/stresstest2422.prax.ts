/**
 * StressTest2422 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2422",
    "description": "Stress test component 2422 with medium configuration",
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