/**
 * StressTest3798 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest3798",
    "description": "Stress test component 3798 with complex configuration",
    "category": "media"
  },
  "uses": {
    "variants": [
      "primary",
      "secondary",
      "tertiary"
    ],
    "sizes": [
      "12",
      "16",
      "20",
      "24",
      "32"
    ],
    "states": [
      "isDisabled",
      "isLoading"
    ],
    "interactions": [
      "onClick",
      "onHover",
      "onFocus",
      "onBlur"
    ],
    "styling": [
      "className",
      "style",
      "css"
    ],
    "accessibility": [
      "aria-label",
      "aria-describedby",
      "role"
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