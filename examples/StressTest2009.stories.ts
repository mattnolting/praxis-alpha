import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2009 } from './StressTest2009'

const meta: Meta = { title: 'Components/StressTest2009', component: StressTest2009 }
export default meta
export const Default: StoryObj = { args: { variant: 'subtle', size: 'tiny' } }