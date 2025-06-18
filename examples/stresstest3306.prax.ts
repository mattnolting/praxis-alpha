/**
 * StressTest3306 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3306",
    "description": "Stress test component 3306 with medium configuration",
    "category": "feedback"
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