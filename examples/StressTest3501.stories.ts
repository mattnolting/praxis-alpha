import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3501 } from './StressTest3501'

const meta: Meta = { title: 'Components/StressTest3501', component: StressTest3501 }
export default meta
export const Default: StoryObj = { args: { variant: 'light', size: 'tiny' } }