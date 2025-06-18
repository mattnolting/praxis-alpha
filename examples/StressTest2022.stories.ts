import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2022 } from './StressTest2022'

const meta: Meta = { title: 'Components/StressTest2022', component: StressTest2022 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: '12' } }