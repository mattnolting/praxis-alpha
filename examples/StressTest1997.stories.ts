import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1997 } from './StressTest1997'

const meta: Meta = { title: 'Components/StressTest1997', component: StressTest1997 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }