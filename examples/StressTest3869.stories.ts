import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3869 } from './StressTest3869'

const meta: Meta = { title: 'Components/StressTest3869', component: StressTest3869 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }