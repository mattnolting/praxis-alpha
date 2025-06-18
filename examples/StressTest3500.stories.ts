import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3500 } from './StressTest3500'

const meta: Meta = { title: 'Components/StressTest3500', component: StressTest3500 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }