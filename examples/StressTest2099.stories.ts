import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2099 } from './StressTest2099'

const meta: Meta = { title: 'Components/StressTest2099', component: StressTest2099 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }