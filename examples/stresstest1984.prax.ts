/**
 * StressTest1984 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest1984",
    "description": "Stress test component 1984 with medium configuration",
    "category": "input"
  },
  "uses": {
    "variants": [
      "small",
      "medium",
      "large"
    ],
    "sizes": [
      "xs",
      "sm",
      "md",
      "lg"
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