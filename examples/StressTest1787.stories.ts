import type { Meta, StoryObj } from '@storybook/react'
import { StressTest1787 } from './StressTest1787'

const meta: Meta = { title: 'Components/StressTest1787', component: StressTest1787 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'compact' } }