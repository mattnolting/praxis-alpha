import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1803 } from './StressTest1803'

const meta: Meta = { title: 'Components/StressTest1803', component: StressTest1803 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }