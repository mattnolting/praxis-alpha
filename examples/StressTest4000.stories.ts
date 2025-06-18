import type { Meta, StoryObj } from '@storybook/react'
import { StressTest4000 } from './StressTest4000'

const meta: Meta = { title: 'Components/StressTest4000', component: StressTest4000 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: 'xs' } }