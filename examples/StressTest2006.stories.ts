import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2006 } from './StressTest2006'

const meta: Meta = { title: 'Components/StressTest2006', component: StressTest2006 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: '12' } }