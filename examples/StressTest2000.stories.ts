import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2000 } from './StressTest2000'

const meta: Meta = { title: 'Components/StressTest2000', component: StressTest2000 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }