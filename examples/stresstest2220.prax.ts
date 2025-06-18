/**
 * StressTest2220 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest2220",
    "description": "Stress test component 2220 with medium configuration",
    "category": "layout"
  },
  "uses": {
    "variants": [
      "primary",
      "secondary",
      "tertiary"
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