import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1883 } from './StressTest1883'

const meta: Meta = { title: 'Components/StressTest1883', component: StressTest1883 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }