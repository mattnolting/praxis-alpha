/**
 * StressTest2302 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2302",
    "description": "Stress test component 2302 with medium configuration",
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