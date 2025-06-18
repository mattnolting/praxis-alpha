import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2011 } from './StressTest2011'

const meta: Meta = { title: 'Components/StressTest2011', component: StressTest2011 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'compact' } }