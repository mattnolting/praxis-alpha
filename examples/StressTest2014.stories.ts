import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2014 } from './StressTest2014'

const meta: Meta = { title: 'Components/StressTest2014', component: StressTest2014 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: '12' } }