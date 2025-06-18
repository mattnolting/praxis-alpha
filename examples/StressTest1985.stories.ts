import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1985 } from './StressTest1985'

const meta: Meta = { title: 'Components/StressTest1985', component: StressTest1985 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }