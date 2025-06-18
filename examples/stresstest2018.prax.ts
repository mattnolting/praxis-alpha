/**
 * StressTest2018 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2018",
    "description": "Stress test component 2018 with medium configuration",
    "category": "feedback"
  },
  "uses": {
    "variants": [
      "success",
      "warning",
      "danger"
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