import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3275 } from './StressTest3275'

const meta: Meta = { title: 'Components/StressTest3275', component: StressTest3275 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }