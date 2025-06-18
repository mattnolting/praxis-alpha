import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3002 } from './StressTest3002'

const meta: Meta = { title: 'Components/StressTest3002', component: StressTest3002 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: '12' } }