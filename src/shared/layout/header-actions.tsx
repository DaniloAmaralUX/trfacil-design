import { ThemeSwitch } from '@/shared/components/theme-switch'

type HeaderActionsProps = {
  children?: React.ReactNode
}

export function HeaderActions({ children }: HeaderActionsProps) {
  return (
    <div className='ms-auto flex items-center gap-3'>
      {children}
      <ThemeSwitch />
    </div>
  )
}
