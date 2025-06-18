/**
 * StressTest3625 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest3625",
    "description": "Stress test component 3625 with complex configuration",
    "category": "display"
  },
  "uses": {
    "variants": [
      "default",
      "outlined",
      "filled",
      "ghost"
    ],
    "sizes": [
      "tiny",
      "small",
      "medium",
      "large",
      "huge"
    ],
    "states": [
      "isActive",
      "isSelected",
      "isFocused"
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