import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2091 } from './StressTest2091'

const meta: Meta = { title: 'Components/StressTest2091', component: StressTest2091 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }