import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3145 } from './StressTest3145'

const meta: Meta = { title: 'Components/StressTest3145', component: StressTest3145 }
export default meta
export const Default: StoryObj = { args: { variant: 'default', size: 'tiny' } }