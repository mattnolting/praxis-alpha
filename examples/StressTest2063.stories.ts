import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2063 } from './StressTest2063'

const meta: Meta = { title: 'Components/StressTest2063', component: StressTest2063 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }