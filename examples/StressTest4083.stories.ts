import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4083 } from './StressTest4083'

const meta: Meta = { title: 'Components/StressTest4083', component: StressTest4083 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }