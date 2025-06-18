import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2023 } from './StressTest2023'

const meta: Meta = { title: 'Components/StressTest2023', component: StressTest2023 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'compact' } }