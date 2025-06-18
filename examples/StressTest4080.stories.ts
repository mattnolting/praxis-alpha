import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4080 } from './StressTest4080'

const meta: Meta = { title: 'Components/StressTest4080', component: StressTest4080 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: 'xs' } }