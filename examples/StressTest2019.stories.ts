import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2019 } from './StressTest2019'

const meta: Meta = { title: 'Components/StressTest2019', component: StressTest2019 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }