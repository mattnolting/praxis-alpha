import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './IconButton'

const meta: Meta = { title: 'Components/IconButton', component: IconButton }
export default meta
export const Default: StoryObj = { args: { variant: 'solid', size: 'xs' } }