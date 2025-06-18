import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1801 } from './StressTest1801'

const meta: Meta = { title: 'Components/StressTest1801', component: StressTest1801 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }