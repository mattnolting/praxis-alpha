import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4095 } from './StressTest4095'

const meta: Meta = { title: 'Components/StressTest4095', component: StressTest4095 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }