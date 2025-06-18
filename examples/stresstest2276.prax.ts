/**
 * StressTest2276 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2276",
    "description": "Stress test component 2276 with medium configuration",
    "category": "layout"
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