import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1789 } from './StressTest1789'

const meta: Meta = { title: 'Components/StressTest1789', component: StressTest1789 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }