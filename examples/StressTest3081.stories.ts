import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3081 } from './StressTest3081'

const meta: Meta = { title: 'Components/StressTest3081', component: StressTest3081 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'tiny' } }