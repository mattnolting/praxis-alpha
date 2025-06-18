import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2020 } from './StressTest2020'

const meta: Meta = { title: 'Components/StressTest2020', component: StressTest2020 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: 'xs' } }