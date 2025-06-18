import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3101 } from './StressTest3101'

const meta: Meta = { title: 'Components/StressTest3101', component: StressTest3101 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }