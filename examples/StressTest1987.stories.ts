import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1987 } from './StressTest1987'

const meta: Meta = { title: 'Components/StressTest1987', component: StressTest1987 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'compact' } }