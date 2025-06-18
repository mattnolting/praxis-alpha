import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1000 } from './StressTest1000'

const meta: Meta = { title: 'Components/StressTest1000', component: StressTest1000 }
export default meta
export const Default: StoryObj = { args: { variant: 'small' } }