import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3251 } from './StressTest3251'

const meta: Meta = { title: 'Components/StressTest3251', component: StressTest3251 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }