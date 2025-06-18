import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4091 } from './StressTest4091'

const meta: Meta = { title: 'Components/StressTest4091', component: StressTest4091 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }