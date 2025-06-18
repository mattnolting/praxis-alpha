import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1970 } from './StressTest1970'

const meta: Meta = { title: 'Components/StressTest1970', component: StressTest1970 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: '12' } }