import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta = { title: 'Components/Alert', component: Alert }
export default meta
export const Default: StoryObj = { args: { variant: 'info', size: 'sm' } }