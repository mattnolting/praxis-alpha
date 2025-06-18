import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1995 } from './StressTest1995'

const meta: Meta = { title: 'Components/StressTest1995', component: StressTest1995 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }