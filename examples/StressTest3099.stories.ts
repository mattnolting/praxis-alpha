import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3099 } from './StressTest3099'

const meta: Meta = { title: 'Components/StressTest3099', component: StressTest3099 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }