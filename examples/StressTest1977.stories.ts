import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1977 } from './StressTest1977'

const meta: Meta = { title: 'Components/StressTest1977', component: StressTest1977 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'tiny' } }