export const GLOBAL_PROPS = {
  "isPending": {
    "type": "boolean",
    "category": "state",
    "usage": 277
  },
  "isComplete": {
    "type": "boolean",
    "category": "state",
    "usage": 277
  },
  "isError": {
    "type": "boolean",
    "category": "state",
    "usage": 277
  },
  "isExpanded": {
    "type": "boolean",
    "category": "state",
    "usage": 277
  },
  "isCollapsed": {
    "type": "boolean",
    "category": "state",
    "usage": 277
  },
  "isActive": {
    "type": "boolean",
    "category": "state",
    "usage": 278
  },
  "isSelected": {
    "type": "boolean",
    "category": "state",
    "usage": 278
  },
  "isFocused": {
    "type": "boolean",
    "category": "state",
    "usage": 278
  },
  "isVisible": {
    "type": "boolean",
    "category": "state",
    "usage": 279
  },
  "isHidden": {
    "type": "boolean",
    "category": "state",
    "usage": 278
  },
  "isAnimating": {
    "type": "boolean",
    "category": "state",
    "usage": 278
  },
  "isEditable": {
    "type": "boolean",
    "category": "state",
    "usage": 278
  },
  "isReadonly": {
    "type": "boolean",
    "category": "state",
    "usage": 278
  },
  "isLocked": {
    "type": "boolean",
    "category": "state",
    "usage": 278
  },
  "isDisabled": {
    "type": "boolean",
    "category": "state",
    "usage": 279
  },
  "isLoading": {
    "type": "boolean",
    "category": "state",
    "usage": 279
  },
  "disabled": {
    "type": "boolean",
    "category": "state",
    "usage": 3
  },
  "size": {
    "type": {
      "type": "enum",
      "values": [
        "tiny",
        "small",
        "medium",
        "large",
        "huge",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "compact",
        "comfortable",
        "spacious",
        "12",
        "16",
        "20",
        "24",
        "32",
        "full"
      ]
    },
    "category": "value",
    "usage": 3339
  },
  "variant": {
    "type": {
      "type": "enum",
      "values": [
        "light",
        "dark",
        "auto",
        "success",
        "warning",
        "danger",
        "info",
        "default",
        "outlined",
        "filled",
        "ghost",
        "small",
        "medium",
        "large",
        "xlarge",
        "subtle",
        "bold",
        "minimal",
        "primary",
        "secondary",
        "tertiary",
        "solid",
        "outline",
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
        "flushed",
        "unstyled",
        "error",
        "center",
        "top",
        "bottom",
        "elevated",
        "none",
        "sm",
        "md",
        "lg"
      ]
    },
    "category": "value",
    "usage": 5006
  }
}

export const getPropType = (propName) => GLOBAL_PROPS[propName]?.type
export const isGlobalProp = (propName) => propName in GLOBAL_PROPS
export const isStateProp = (propName) => GLOBAL_PROPS[propName]?.category === 'state'
export const isValueProp = (propName) => GLOBAL_PROPS[propName]?.category === 'value'