/**
 * StressTest3792 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest3792",
    "description": "Stress test component 3792 with complex configuration",
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
      "lg",
      "xl"
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