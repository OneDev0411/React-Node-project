import React from '@libs/react'

const { createContext, useCallback, useState } = React;

export interface RoleContextApi {
    roles: IDealRole[],
    add?: (role: IDealRole) => void,
    test?: () => void,
}

const user: IUser = {
    last_seen_at: null,
    cover_image_thumbnail_url: null,
    brand: null,
    id: null,
    email_confirmed: true,
    phone_confirmed: true,
    timezone: "",
    active_brand: null,
    agents: null,
    personal_room: null,
    user_type: 'Agent',
    first_name: null,
    last_name: null,
    display_name: '',
    email: '',
    phone_number: null,
    is_shadow: false,
    profile_image_url: null,
    cover_image_url: null,
    email_signature: null,
    access_token: '',
    refresh_token: '',
    facebook: undefined,
    twitter: undefined,
    linkedin: undefined,
    youtube: undefined,
    instagram: undefined,
    type: 'user',
    created_at: 0,
    updated_at: 0
}

const defaultRole: IDealRole = {
    agent: null,
    agent_brokerwolf_id: null,
    brokerwolf_contact_type: null,
    brokerwolf_id: null,
    brokerwolf_row_version: null,
    checklist: [],
    commission_dollar: null,
    commission_percentage: null,
    company_title: "",
    created_at: Number((new Date()).getTime()),
    created_by: null,
    deal: "",
    deleted_at: null,
    current_address: null,
    email: "",
    id: null,
    legal_first_name: "Remon",
    legal_full_name: "Aiman",
    legal_last_name: "",
    legal_middle_name: null,
    legal_prefix: "",
    mlsid: null,
    phone_number: "",
    role: "Seller",
    role_type: 'Person',
    type: "",
    updated_at: Number((new Date()).getTime()),
    user: user,
    brand: null,
}


const defaultValue = {
    roles: [defaultRole]
};

export const RoleContext = React.createContext<Partial<RoleContextApi>>({})

export const RoleProvider: React.FC<any> = ({ children }) => {
  const [roles, setRoles] = React.useState<RoleContextApi['roles']>([])

  const add = (role: IDealRole) => {
    setRoles([...roles, role]);
  }

  const test = () => {
    console.log('test func');
  }

  return (
    <RoleContext.Provider value={{ roles, add, test }}>
      {children}
    </RoleContext.Provider>
  )
}
