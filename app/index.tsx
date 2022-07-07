import React from '@libs/react'
import App from './App'
import { createComponents } from './core/utils/create-components'
import './index.css'
import { AppContextApi } from './models/type';
import { defaultDealData, defaultRemittanceChecks, defaultRole } from './util';
const { createContext, useState } = React;

const defaultValue: AppContextApi = {
  dealData: defaultDealData,
  roleData: [],
  remittanceChecks: []
};

export const AppContext = createContext<AppContextApi>(defaultValue);

export const AppProvider: React.FC<any> = ({ children }) => {
  const [dealData, setDealData] = useState<AppContextApi['dealData']>(defaultDealData);
  const [roleData, setRoleData] = useState<AppContextApi['roleData']>([]);
  const [remittanceChecks, setRemittanceChecks] = useState<AppContextApi['remittanceChecks']>(defaultRemittanceChecks);

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
    <AppContext.Provider value={{ dealData, setDealData, roleData, setRoleData, remittanceChecks, setRemittanceChecks }}>
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
