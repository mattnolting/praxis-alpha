import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'

const meta: Meta = { title: 'Components/Modal', component: Modal }
export default meta
export const Default: StoryObj = { args: { variant: 'center', size: 'sm' } }