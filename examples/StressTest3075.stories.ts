import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3075 } from './StressTest3075'

const meta: Meta = { title: 'Components/StressTest3075', component: StressTest3075 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'compact' } }