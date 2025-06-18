import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2003 } from './StressTest2003'

const meta: Meta = { title: 'Components/StressTest2003', component: StressTest2003 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }