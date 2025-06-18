import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2010 } from './StressTest2010'

const meta: Meta = { title: 'Components/StressTest2010', component: StressTest2010 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: '12' } }