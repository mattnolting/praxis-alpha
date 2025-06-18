import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4500 } from './StressTest4500'

const meta: Meta = { title: 'Components/StressTest4500', component: StressTest4500 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: 'xs' } }