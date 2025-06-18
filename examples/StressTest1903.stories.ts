import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1903 } from './StressTest1903'

const meta: Meta = { title: 'Components/StressTest1903', component: StressTest1903 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'compact' } }