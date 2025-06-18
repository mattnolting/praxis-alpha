import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2601 } from './StressTest2601'

const meta: Meta = { title: 'Components/StressTest2601', component: StressTest2601 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'tiny' } }