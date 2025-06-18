/**
 * Alert Component Configuration
 * Pure Bun, zero dependencies
 */
export default {
  component: {
    name: 'Alert',
    description: 'Alerts component for displaying important messages to users',
    category: 'feedback'
  },
  uses: {
    variants: ['info', 'success', 'warning', 'error'],
    sizes: ['sm', 'md', 'lg'] as const,
    states: ['isVisible', 'isDismissible', 'isLoading'] as const,
    accessibility: ['aria-label', 'aria-describedby', 'role'] as const,
    interactions: ['onDismiss', 'onActionClick'] as const,
    styling: ['className', 'style'] as const
  },
  output: {
    json: true,        // alert.props.json (runtime-friendly)
    yaml: false,       // alert.props.yaml
    typescript: false, // AlertProps.ts
    schema: false,     // alert.schema.json
    markdown: false    // Alert.md
  }
} as const
