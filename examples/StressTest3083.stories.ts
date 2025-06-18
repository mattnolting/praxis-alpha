import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3083 } from './StressTest3083'

const meta: Meta = { title: 'Components/StressTest3083', component: StressTest3083 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }