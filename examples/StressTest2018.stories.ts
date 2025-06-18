import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2018 } from './StressTest2018'

const meta: Meta = { title: 'Components/StressTest2018', component: StressTest2018 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: '12' } }