import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1805 } from './StressTest1805'

const meta: Meta = { title: 'Components/StressTest1805', component: StressTest1805 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }