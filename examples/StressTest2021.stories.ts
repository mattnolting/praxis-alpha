import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2021 } from './StressTest2021'

const meta: Meta = { title: 'Components/StressTest2021', component: StressTest2021 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }