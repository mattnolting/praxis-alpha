import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1900 } from './StressTest1900'

const meta: Meta = { title: 'Components/StressTest1900', component: StressTest1900 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: 'xs' } }