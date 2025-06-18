import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3601 } from './StressTest3601'

const meta: Meta = { title: 'Components/StressTest3601', component: StressTest3601 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }