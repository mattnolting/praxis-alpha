import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta = { title: 'Components/Input', component: Input }
export default meta
export const Default: StoryObj = { args: { variant: 'text', size: 'xs' } }