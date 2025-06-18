/**
 * StressTest2752 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2752",
    "description": "Stress test component 2752 with medium configuration",
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