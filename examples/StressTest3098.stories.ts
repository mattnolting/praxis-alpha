import type { Meta, StoryObj } from '@storybook/react'
import { StressTest3098 } from './StressTest3098'

const meta: Meta = { title: 'Components/StressTest3098', component: StressTest3098 }
export default meta
export const Default: StoryObj = { args: { variant: 'success', size: '12' } }