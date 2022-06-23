import React from '@libs/react'
import App from './App'
import { createComponents } from './core/utils/create-components'
import './index.css'
import { AppContextApi, GCIUnit } from './models/type';

const { createContext, useState } = React;

const defaultValue: AppContextApi = {
  GCIUnit: "",
};

export const AppContext = createContext<AppContextApi>(defaultValue);

export const AppProvider: React.FC<any> = ({ children }) => {
  const [GCIUnit, setGCIUnit] = useState<AppContextApi['GCIUnit']>("")

  // const setGCIUnit = (_GCIUnit: GCIUnit) => {
  //   _setGCIUnit(_GCIUnit);
  // }
  //   const clear = () => setRoles([])
  //   const remove = (id: string) => {
  // setRoles((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id))
  //   }
  // const add = () => {
  //   setTestData("puhahaha");
  // }

  // const test = () => {
  //   console.log('test func');
  // }

  return (
    <AppContext.Provider value={{ GCIUnit, setGCIUnit }}>
      {children}
    </AppContext.Provider>
  )
}


export default function Bootstrap({ Components, ...props }: EntryProps) {
  return (
    <AppProvider>
      <App Components={createComponents(Components)} {...props} />
    </AppProvider>
  )
}
