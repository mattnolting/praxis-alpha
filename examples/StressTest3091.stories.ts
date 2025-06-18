import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3091 } from './StressTest3091'

const meta: Meta = { title: 'Components/StressTest3091', component: StressTest3091 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'compact' } }