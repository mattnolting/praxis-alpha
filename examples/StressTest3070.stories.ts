import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3070 } from './StressTest3070'

const meta: Meta = { title: 'Components/StressTest3070', component: StressTest3070 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: '12' } }