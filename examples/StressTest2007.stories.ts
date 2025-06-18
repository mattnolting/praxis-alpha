import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2007 } from './StressTest2007'

const meta: Meta = { title: 'Components/StressTest2007', component: StressTest2007 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }