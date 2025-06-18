import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2093 } from './StressTest2093'

const meta: Meta = { title: 'Components/StressTest2093', component: StressTest2093 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }