import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1976 } from './StressTest1976'

const meta: Meta = { title: 'Components/StressTest1976', component: StressTest1976 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }