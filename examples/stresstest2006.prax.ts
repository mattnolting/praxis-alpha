/**
 * StressTest2006 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2006",
    "description": "Stress test component 2006 with medium configuration",
    "category": "media"
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