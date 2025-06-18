import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1975 } from './StressTest1975'

const meta: Meta = { title: 'Components/StressTest1975', component: StressTest1975 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'compact' } }