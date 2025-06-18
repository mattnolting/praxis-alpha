import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3771 } from './StressTest3771'

const meta: Meta = { title: 'Components/StressTest3771', component: StressTest3771 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }