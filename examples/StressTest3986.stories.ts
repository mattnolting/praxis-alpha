import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3986 } from './StressTest3986'

const meta: Meta = { title: 'Components/StressTest3986', component: StressTest3986 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: '12' } }