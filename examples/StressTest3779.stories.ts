import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3779 } from './StressTest3779'

const meta: Meta = { title: 'Components/StressTest3779', component: StressTest3779 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }