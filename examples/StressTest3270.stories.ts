import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3270 } from './StressTest3270'

const meta: Meta = { title: 'Components/StressTest3270', component: StressTest3270 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: '12' } }