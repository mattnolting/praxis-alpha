import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3750 } from './StressTest3750'

const meta: Meta = { title: 'Components/StressTest3750', component: StressTest3750 }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: '12' } }