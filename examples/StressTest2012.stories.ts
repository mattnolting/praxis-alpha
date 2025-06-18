import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2012 } from './StressTest2012'

const meta: Meta = { title: 'Components/StressTest2012', component: StressTest2012 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }