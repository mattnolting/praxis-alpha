import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3800 } from './StressTest3800'

const meta: Meta = { title: 'Components/StressTest3800', component: StressTest3800 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }