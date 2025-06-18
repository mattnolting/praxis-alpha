import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta = { title: 'Components/Button', component: Button }
export default meta
export const Default: StoryObj = { args: { variant: 'primary', size: 'sm' } }