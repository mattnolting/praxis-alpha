import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2004 } from './StressTest2004'

const meta: Meta = { title: 'Components/StressTest2004', component: StressTest2004 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: 'xs' } }