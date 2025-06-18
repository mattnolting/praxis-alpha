import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2008 } from './StressTest2008'

const meta: Meta = { title: 'Components/StressTest2008', component: StressTest2008 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: 'xs' } }