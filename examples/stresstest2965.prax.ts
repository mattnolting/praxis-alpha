/**
 * StressTest2965 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2965",
    "description": "Stress test component 2965 with medium configuration",
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