import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1823 } from './StressTest1823'

const meta: Meta = { title: 'Components/StressTest1823', component: StressTest1823 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }