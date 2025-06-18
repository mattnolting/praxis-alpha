import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3200 } from './StressTest3200'

const meta: Meta = { title: 'Components/StressTest3200', component: StressTest3200 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }