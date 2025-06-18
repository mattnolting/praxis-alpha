/**
 * StressTest3002 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3002",
    "description": "Stress test component 3002 with medium configuration",
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