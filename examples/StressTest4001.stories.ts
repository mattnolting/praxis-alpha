import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4001 } from './StressTest4001'

const meta: Meta = { title: 'Components/StressTest4001', component: StressTest4001 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }