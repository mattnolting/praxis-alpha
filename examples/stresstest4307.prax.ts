/**
 * StressTest4307 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest4307",
    "description": "Stress test component 4307 with complex configuration",
    "category": "navigation"
  },
  "uses": {
    "variants": [
      "subtle",
      "bold",
      "minimal"
    ],
    "sizes": [
      "compact",
      "comfortable",
      "spacious"
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