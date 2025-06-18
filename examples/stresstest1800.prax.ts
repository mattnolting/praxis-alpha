/**
 * StressTest1800 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest1800",
    "description": "Stress test component 1800 with medium configuration",
    "category": "input"
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