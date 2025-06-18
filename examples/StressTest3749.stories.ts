import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3749 } from './StressTest3749'

const meta: Meta = { title: 'Components/StressTest3749', component: StressTest3749 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }