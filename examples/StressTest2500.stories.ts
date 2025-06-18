import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2500 } from './StressTest2500'

const meta: Meta = { title: 'Components/StressTest2500', component: StressTest2500 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: 'xs' } }