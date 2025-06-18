import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1990 } from './StressTest1990'

const meta: Meta = { title: 'Components/StressTest1990', component: StressTest1990 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: '12' } }