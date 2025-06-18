/**
 * StressTest2002 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2002",
    "description": "Stress test component 2002 with medium configuration",
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