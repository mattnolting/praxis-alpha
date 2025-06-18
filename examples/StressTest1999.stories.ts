import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1999 } from './StressTest1999'

const meta: Meta = { title: 'Components/StressTest1999', component: StressTest1999 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'compact' } }