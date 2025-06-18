import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2013 } from './StressTest2013'

const meta: Meta = { title: 'Components/StressTest2013', component: StressTest2013 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'tiny' } }