/**
 * StressTest3260 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3260",
    "description": "Stress test component 3260 with medium configuration",
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