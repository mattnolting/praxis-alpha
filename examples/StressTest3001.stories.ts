import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3001 } from './StressTest3001'

const meta: Meta = { title: 'Components/StressTest3001', component: StressTest3001 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }