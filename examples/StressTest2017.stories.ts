import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2017 } from './StressTest2017'

const meta: Meta = { title: 'Components/StressTest2017', component: StressTest2017 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }