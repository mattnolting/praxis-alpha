/**
 * StressTest2525 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2525",
    "description": "Stress test component 2525 with medium configuration",
    "category": "data"
  },
  "uses": {
    "variants": [
      "subtle",
      "bold",
      "minimal"
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