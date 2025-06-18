import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1901 } from './StressTest1901'

const meta: Meta = { title: 'Components/StressTest1901', component: StressTest1901 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }