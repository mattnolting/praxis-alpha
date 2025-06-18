/**
 * StressTest2360 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2360",
    "description": "Stress test component 2360 with medium configuration",
    "category": "input"
  },
  "uses": {
    "variants": [
      "success",
      "warning",
      "danger"
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