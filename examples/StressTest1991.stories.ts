import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1991 } from './StressTest1991'

const meta: Meta = { title: 'Components/StressTest1991', component: StressTest1991 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }