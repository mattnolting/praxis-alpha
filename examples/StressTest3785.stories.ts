import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3785 } from './StressTest3785'

const meta: Meta = { title: 'Components/StressTest3785', component: StressTest3785 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }