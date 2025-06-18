import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3063 } from './StressTest3063'

const meta: Meta = { title: 'Components/StressTest3063', component: StressTest3063 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }