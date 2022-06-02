declare interface IModel<T extends string> {
  type: T
  id: UUID
  created_at: number
  updated_at: number

  // not sure if it's nullable or optional. One example where it doesn't exist
  // at all : brand_flow_step.
  deleted_at?: Nullable<number>
}
