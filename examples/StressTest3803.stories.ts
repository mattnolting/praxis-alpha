import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3803 } from './StressTest3803'

const meta: Meta = { title: 'Components/StressTest3803', component: StressTest3803 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }