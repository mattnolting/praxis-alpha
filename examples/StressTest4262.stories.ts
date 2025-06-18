import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4262 } from './StressTest4262'

const meta: Meta = { title: 'Components/StressTest4262', component: StressTest4262 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: '12' } }