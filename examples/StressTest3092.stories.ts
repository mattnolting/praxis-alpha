import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3092 } from './StressTest3092'

const meta: Meta = { title: 'Components/StressTest3092', component: StressTest3092 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: 'xs' } }