/**
 * StressTest2533 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2533",
    "description": "Stress test component 2533 with medium configuration",
    "category": "data"
  },
  "uses": {
    "variants": [
      "default",
      "outlined",
      "filled"
    ],
    "sizes": [
      "tiny",
      "small",
      "medium",
      "large"
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