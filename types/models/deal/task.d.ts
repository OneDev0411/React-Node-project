declare type IDealTaskType =
  | 'Form'
  | 'GeneralComments'
  | 'Generic'
  | 'YardSign'
  | 'OpenHouse'
  | 'Media'
  | 'Splitter'
  | 'Application'

declare interface IDealTaskRoom extends IModel<'room'> {
  attachments: IFile[] | null
  latest_message: IChatMessage
  latest_activity: IChatActivity
  new_notifications: number
  notification_settings: any
  owner: null
  proposed_title: string
  room_type: string
  title: string
  users: IUser[]
}

declare interface IDealTaskSubmission extends IModel<'form_submission'> {
  author: UUID
  file: IFile
  form: UUID
  formstack_id: number | null // deprecated
  last_revision: UUID
  revision_count: number
  state: string
  title: string
}

declare interface IDealTaskApplication extends IModel<'application'> {
  url: 'string'
}

declare interface IDealTask extends IModel<'task'> {
  attention_requested: boolean
  attention_requested_at: string | null
  checklist: UUID
  deal: UUID
  form: UUID
  application: IDealTaskApplication
  is_deletable: boolean
  pdf_url: string
  required: boolean
  task_type: IDealTaskType
  title: string
  submission: IDealTaskSubmission | null
  room: IDealTaskRoom
  order: number
  acl: ('Agents' | 'BackOffice')[]
  review: null | {
    id: UUID
    created_at: number
    type: 'review'
    status: string
    updated_at: number
  }
}
