import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1825 } from './StressTest1825'

const meta: Meta = { title: 'Components/StressTest1825', component: StressTest1825 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }