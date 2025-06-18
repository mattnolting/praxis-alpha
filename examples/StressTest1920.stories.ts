import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1920 } from './StressTest1920'

const meta: Meta = { title: 'Components/StressTest1920', component: StressTest1920 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: 'xs' } }