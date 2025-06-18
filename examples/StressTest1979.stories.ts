import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1979 } from './StressTest1979'

const meta: Meta = { title: 'Components/StressTest1979', component: StressTest1979 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }