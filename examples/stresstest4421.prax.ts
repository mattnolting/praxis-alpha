/**
 * StressTest4421 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest4421",
    "description": "Stress test component 4421 with complex configuration",
    "category": "data"
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