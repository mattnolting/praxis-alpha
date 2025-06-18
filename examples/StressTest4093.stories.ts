import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4093 } from './StressTest4093'

const meta: Meta = { title: 'Components/StressTest4093', component: StressTest4093 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }