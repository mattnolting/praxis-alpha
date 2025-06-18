import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3090 } from './StressTest3090'

const meta: Meta = { title: 'Components/StressTest3090', component: StressTest3090 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: '12' } }