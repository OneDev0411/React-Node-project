const STATUSES: {
  none: 'none'
  info: 'info'
  success: 'success'
  loading: 'loading'
  warning: 'warning'
  error: 'error'
}

declare const POSITIONS: {
  topCenter: 'top-center'
  topLeft: 'top-left'
  topRight: 'top-right'
  bottomCenter: 'bottom-center'
  bottomLeft: 'bottom-left'
  bottomRight: 'bottom-right'
}

interface NotificationButton {
  name: string
  primary?: boolean
  onClick?: (...args: any[]) => void
}
declare type Status = typeof STATUSES[keyof typeof STATUSES]
declare type Position = typeof POSITIONS[keyof typeof POSITIONS]
interface BaseNotification {
  id: string
  title?: string
  message?: string
  status: Status
  position: Position
  buttons: NotificationButton[]
  image?: string
  dismissAfter?: number
  dismissible?: boolean
  onAdd?: (...args: any[]) => void
  onDismiss?: (...args: any[]) => void
  showDismissButton?: boolean
  allowHTML?: boolean
  [index: string]: any
}
declare type NewNotification = Partial<Notification>

declare interface NotificationData {
  message: string
  status: BaseNotification['status']
  options?: Omit<BaseNotification, 'message' | 'status'>
}
