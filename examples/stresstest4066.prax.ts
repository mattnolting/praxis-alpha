/**
 * StressTest4066 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest4066",
    "description": "Stress test component 4066 with complex configuration",
    "category": "feedback"
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