import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1971 } from './StressTest1971'

const meta: Meta = { title: 'Components/StressTest1971', component: StressTest1971 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }