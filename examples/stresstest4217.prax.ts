/**
 * StressTest4217 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest4217",
    "description": "Stress test component 4217 with complex configuration",
    "category": "display"
  },
  "uses": {
    "variants": [
      "subtle",
      "bold",
      "minimal"
    ],
    "sizes": [
      "tiny",
      "small",
      "medium",
      "large",
      "huge"
    ],
    "states": [
      "isEditable",
      "isReadonly",
      "isLocked"
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