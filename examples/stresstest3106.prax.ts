/**
 * StressTest3106 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3106",
    "description": "Stress test component 3106 with medium configuration",
    "category": "feedback"
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