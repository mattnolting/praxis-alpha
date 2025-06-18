import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1024 } from './StressTest1024'

const meta: Meta = { title: 'Components/StressTest1024', component: StressTest1024 }
export default meta
export const Default: StoryObj = { args: { variant: 'small' } }