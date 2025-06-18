/**
 * StressTest3266 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3266",
    "description": "Stress test component 3266 with medium configuration",
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