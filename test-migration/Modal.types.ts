// Modal component interface
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  placement?: 'center' | 'top' | 'bottom'
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  showCloseButton?: boolean
  title?: string
  children: React.ReactNode
}

// Card component interface  
export interface CardProps {
  variant?: 'outline' | 'filled' | 'elevated' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  disabled?: boolean
  className?: string
  children: React.ReactNode
}
