/**
 * StressTest3300 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3300",
    "description": "Stress test component 3300 with medium configuration",
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