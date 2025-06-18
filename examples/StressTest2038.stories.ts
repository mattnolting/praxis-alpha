import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2038 } from './StressTest2038'

const meta: Meta = { title: 'Components/StressTest2038', component: StressTest2038 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: '12' } }