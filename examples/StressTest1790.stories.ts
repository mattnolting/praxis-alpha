import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1790 } from './StressTest1790'

const meta: Meta = { title: 'Components/StressTest1790', component: StressTest1790 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: '12' } }