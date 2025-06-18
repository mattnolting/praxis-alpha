import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4090 } from './StressTest4090'

const meta: Meta = { title: 'Components/StressTest4090', component: StressTest4090 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: '12' } }