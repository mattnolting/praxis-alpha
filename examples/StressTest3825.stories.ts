import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3825 } from './StressTest3825'

const meta: Meta = { title: 'Components/StressTest3825', component: StressTest3825 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'tiny' } }