import App from './App'
import { createComponents } from './core/utils/create-components'
import './index.css'
import React from '@libs/react'
import { RoleContextApi } from './models/type'

export const RoleContext = React.createContext<Partial<RoleContextApi>>({})

const RoleProvider: React.FC<any> = ({ children }) => {
  const [roles, setRoles] = React.useState<RoleContextApi['roles']>([])

  //   const clear = () => setRoles([])
  //   const remove = (id: string) => {
  // setRoles((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id))
  //   }
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

export default function Bootstrap({ Components, ...props }: EntryProps) {
  return (
    <RoleProvider>
      <App Components={createComponents(Components)} {...props} />
    </RoleProvider>
  )
}
