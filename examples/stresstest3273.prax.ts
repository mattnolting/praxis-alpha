/**
 * StressTest3273 - Stress test component
 * Complexity: Medium
 */
export default {
  "component": {
    "name": "StressTest3273",
    "description": "Stress test component 3273 with medium configuration",
    "category": "display"
  },
  "uses": {
    "variants": [
      "light",
      "dark",
      "auto"
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