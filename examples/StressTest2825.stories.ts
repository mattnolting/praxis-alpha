import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2825 } from './StressTest2825'

const meta: Meta = { title: 'Components/StressTest2825', component: StressTest2825 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }