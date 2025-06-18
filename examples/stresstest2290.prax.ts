/**
 * StressTest2290 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2290",
    "description": "Stress test component 2290 with medium configuration",
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