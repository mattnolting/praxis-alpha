import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1001 } from './StressTest1001'

const meta: Meta = { title: 'Components/StressTest1001', component: StressTest1001 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle' } }