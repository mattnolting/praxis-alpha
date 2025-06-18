import type { Meta, StoryObj } from '@storybook/react'
import { StressTest2002 } from './StressTest2002'

const meta: Meta = { title: 'Components/StressTest2002', component: StressTest2002 }
export default meta
export const Default: StoryObj = { args: { variant: 'small', size: '12' } }