import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2090 } from './StressTest2090'

const meta: Meta = { title: 'Components/StressTest2090', component: StressTest2090 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: '12' } }