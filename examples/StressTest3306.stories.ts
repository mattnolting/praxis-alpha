import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3306 } from './StressTest3306'

const meta: Meta = { title: 'Components/StressTest3306', component: StressTest3306 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: '12' } }