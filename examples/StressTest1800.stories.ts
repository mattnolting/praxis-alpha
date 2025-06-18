import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1800 } from './StressTest1800'

const meta: Meta = { title: 'Components/StressTest1800', component: StressTest1800 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: 'xs' } }