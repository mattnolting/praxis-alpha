/**
 * StressTest3221 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3221",
    "description": "Stress test component 3221 with medium configuration",
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