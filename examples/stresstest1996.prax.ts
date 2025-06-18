/**
 * StressTest1996 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest1996",
    "description": "Stress test component 1996 with medium configuration",
    "category": "layout"
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