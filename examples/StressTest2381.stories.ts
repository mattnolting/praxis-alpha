import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2381 } from './StressTest2381'

const meta: Meta = { title: 'Components/StressTest2381', component: StressTest2381 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }