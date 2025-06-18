import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2098 } from './StressTest2098'

const meta: Meta = { title: 'Components/StressTest2098', component: StressTest2098 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: '12' } }