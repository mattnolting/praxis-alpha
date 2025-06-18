import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1897 } from './StressTest1897'

const meta: Meta = { title: 'Components/StressTest1897', component: StressTest1897 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }