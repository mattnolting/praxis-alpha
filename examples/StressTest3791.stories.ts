import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3791 } from './StressTest3791'

const meta: Meta = { title: 'Components/StressTest3791', component: StressTest3791 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }