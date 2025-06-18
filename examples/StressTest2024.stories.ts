import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2024 } from './StressTest2024'

const meta: Meta = { title: 'Components/StressTest2024', component: StressTest2024 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }