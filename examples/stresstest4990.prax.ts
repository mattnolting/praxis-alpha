/**
 * StressTest4990 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest4990",
    "description": "Stress test component 4990 with complex configuration",
    "category": "media"
  },
  "uses": {
    "variants": [
      "small",
      "medium",
      "large",
      "xlarge"
    ],
    "sizes": [
      "12",
      "16",
      "20",
      "24",
      "32"
    ],
    "states": [
      "isVisible",
      "isHidden",
      "isAnimating"
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