import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4443 } from './StressTest4443'

const meta: Meta = { title: 'Components/StressTest4443', component: StressTest4443 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }