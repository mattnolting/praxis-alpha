import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1785 } from './StressTest1785'

const meta: Meta = { title: 'Components/StressTest1785', component: StressTest1785 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'tiny' } }