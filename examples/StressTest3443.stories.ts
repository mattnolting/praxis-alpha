import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3443 } from './StressTest3443'

const meta: Meta = { title: 'Components/StressTest3443', component: StressTest3443 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }