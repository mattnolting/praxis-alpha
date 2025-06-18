// Complex form input interface
export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  placeholder?: string
  isDisabled?: boolean
  isInvalid?: boolean
  isRequired?: boolean
  isReadOnly?: boolean
  errorMessage?: string
  helperText?: string
  label?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
}

// Data table interface
export interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'simple' | 'striped' | 'unstyled'
  isLoading?: boolean
  isEmpty?: boolean
  sortable?: boolean
  selectable?: boolean
  stickyHeader?: boolean
  maxHeight?: string
  onRowClick?: (row: T) => void
  onSelectionChange?: (selectedRows: T[]) => void
}
