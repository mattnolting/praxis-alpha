/**
 * StressTest2473 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2473",
    "description": "Stress test component 2473 with medium configuration",
    "category": "display"
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