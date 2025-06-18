import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1973 } from './StressTest1973'

const meta: Meta = { title: 'Components/StressTest1973', component: StressTest1973 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }