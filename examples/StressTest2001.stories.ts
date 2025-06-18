import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2001 } from './StressTest2001'

const meta: Meta = { title: 'Components/StressTest2001', component: StressTest2001 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'tiny' } }