import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4081 } from './StressTest4081'

const meta: Meta = { title: 'Components/StressTest4081', component: StressTest4081 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }