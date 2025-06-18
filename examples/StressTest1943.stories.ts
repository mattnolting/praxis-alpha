import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1943 } from './StressTest1943'

const meta: Meta = { title: 'Components/StressTest1943', component: StressTest1943 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }