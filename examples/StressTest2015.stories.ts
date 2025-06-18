import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2015 } from './StressTest2015'

const meta: Meta = { title: 'Components/StressTest2015', component: StressTest2015 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }