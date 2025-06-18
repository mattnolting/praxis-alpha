import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3048 } from './StressTest3048'

const meta: Meta = { title: 'Components/StressTest3048', component: StressTest3048 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: 'xs' } }