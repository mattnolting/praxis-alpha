import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3080 } from './StressTest3080'

const meta: Meta = { title: 'Components/StressTest3080', component: StressTest3080 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }