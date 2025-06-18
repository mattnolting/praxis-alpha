import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3093 } from './StressTest3093'

const meta: Meta = { title: 'Components/StressTest3093', component: StressTest3093 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'tiny' } }