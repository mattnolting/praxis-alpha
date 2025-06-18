/**
 * StressTest3590 - Stress test component
 * Complexity: Complex
 */
export default {
  "component": {
    "name": "StressTest3590",
    "description": "Stress test component 3590 with complex configuration",
    "category": "media"
  },
  "uses": {
    "variants": [
      "success",
      "warning",
      "danger",
      "info"
    ],
    "sizes": [
      "12",
      "16",
      "20",
      "24",
      "32"
    ],
    "states": [
      "isExpanded",
      "isCollapsed"
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