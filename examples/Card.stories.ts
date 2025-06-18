import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta = { title: 'Components/Card', component: Card }
export default meta
export const Default: StoryObj = { args: { variant: 'outline', size: 'sm' } }