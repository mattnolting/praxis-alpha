import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3000 } from './StressTest3000'

const meta: Meta = { title: 'Components/StressTest3000', component: StressTest3000 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: 'xs' } }