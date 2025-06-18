/**
 * StressTest4191 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest4191",
    "description": "Stress test component 4191 with complex configuration",
    "category": "overlay"
  },
  "uses": {
    "variants": [
      "light",
      "dark",
      "auto"
    ],
    "sizes": [
      "compact",
      "comfortable",
      "spacious"
    ],
    "states": [
      "isPending",
      "isComplete",
      "isError"
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