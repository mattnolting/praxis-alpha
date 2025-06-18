import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2016 } from './StressTest2016'

const meta: Meta = { title: 'Components/StressTest2016', component: StressTest2016 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: 'xs' } }