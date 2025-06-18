import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1983 } from './StressTest1983'

const meta: Meta = { title: 'Components/StressTest1983', component: StressTest1983 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }