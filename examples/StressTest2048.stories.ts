import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2048 } from './StressTest2048'

const meta: Meta = { title: 'Components/StressTest2048', component: StressTest2048 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }