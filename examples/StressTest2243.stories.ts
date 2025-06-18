import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2243 } from './StressTest2243'

const meta: Meta = { title: 'Components/StressTest2243', component: StressTest2243 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }