import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2083 } from './StressTest2083'

const meta: Meta = { title: 'Components/StressTest2083', component: StressTest2083 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'compact' } }