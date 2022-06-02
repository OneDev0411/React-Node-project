declare interface IUserBase extends IModel<'user'> {
  first_name: string | null
  last_name: string | null
  display_name: string
  email: string
  phone_number: string | null
  is_shadow: boolean
  fake_email?: boolean
  docusign?: IUserDocusign
  profile_image_url: string | null
  cover_image_url: string | null
  email_signature: string | null
  access_token: string
  refresh_token: string
  facebook: Nullable<string>
  twitter: Nullable<string>
  linkedin: Nullable<string>
  youtube: Nullable<string>
  instagram: Nullable<string>
}

declare interface IUser extends IUserBase {
  last_seen_at: number | null
  cover_image_thumbnail_url: string | null
  brand: string | null
  id: UUID
  email_confirmed: boolean
  phone_confirmed: boolean
  timezone: string
  secondary_password?: string
  active_brand: string | null
  agents: Nullable<IAgent[]>
  personal_room: Nullable<UUID>
  user_type: 'Agent' | 'Client' | 'Admin'
}

declare interface IUserDocusign extends IModel<'docusign_account'> {
  email: string
  first_name: string
  last_name: string
}
