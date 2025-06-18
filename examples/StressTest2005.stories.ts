import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2005 } from './StressTest2005'

const meta: Meta = { title: 'Components/StressTest2005', component: StressTest2005 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }