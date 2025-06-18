import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1729 } from './StressTest1729'

const meta: Meta = { title: 'Components/StressTest1729', component: StressTest1729 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }