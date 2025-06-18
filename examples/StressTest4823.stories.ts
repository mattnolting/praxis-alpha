import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4823 } from './StressTest4823'

const meta: Meta = { title: 'Components/StressTest4823', component: StressTest4823 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }