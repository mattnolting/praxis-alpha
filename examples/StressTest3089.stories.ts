import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3089 } from './StressTest3089'

const meta: Meta = { title: 'Components/StressTest3089', component: StressTest3089 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }