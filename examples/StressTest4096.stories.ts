import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4096 } from './StressTest4096'

const meta: Meta = { title: 'Components/StressTest4096', component: StressTest4096 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: 'xs' } }