import React from '@libs/react'
import App from './App'
import { createComponents } from './core/utils/create-components'
import './index.css'
import { AppContextApi } from './models/type';
import { defaultCheckData, defaultPaymentsDataInside, defaultPaymentsDataOutside } from './util';
const { createContext, useState } = React;

const defaultValue: AppContextApi = {
  stagingAmount: 0,
  remittanceBankWireAmount: 0,
  GCIUnit: "",
  GCIValue: 0,
  agentDataList: [],
  testData: "hahaha",
  reasonValue: -1,
  reasonNote: "",
  checkDataList: defaultCheckData,
  paymentsDataInside: defaultPaymentsDataInside,
  paymentsDataOutside: defaultPaymentsDataOutside,
  rolePaymentsDataInside: [],
  rolePaymentsDataOutside: []
};

export const AppContext = createContext<AppContextApi>(defaultValue);

export const AppProvider: React.FC<any> = ({ children }) => {
  const [testData, setTestData] = useState<AppContextApi['testData']>("hahaha");
  const [GCIUnit, setGCIUnit] = useState<AppContextApi['GCIUnit']>("");
  const [GCIValue, setGCIValue] = useState<AppContextApi['GCIValue']>(0);
  const [agentDataList, setAgentDataList] = useState<AppContextApi['agentDataList']>([]);
  const [reasonValue, setReasonValue] = useState<AppContextApi['reasonValue']>(-1);
  const [reasonNote, setReasonNote] = useState<AppContextApi['reasonNote']>("");
  const [stagingAmount, setStagingAmount] = useState<AppContextApi['stagingAmount']>(2000);
  const [remittanceBankWireAmount, setRemittanceBankWireAmount] = useState<AppContextApi['remittanceBankWireAmount']>(0);
  const [checkDataList, setCheckDataList] = useState<AppContextApi['checkDataList']>(defaultCheckData);
  const [paymentsDataInside, setPaymentsDataInside] = useState<AppContextApi['paymentsDataInside']>(defaultPaymentsDataInside);
  const [rolePaymentsDataInside, setRolePaymentsDataInside] = useState<AppContextApi['rolePaymentsDataInside']>([]);
  const [paymentsDataOutside, setPaymentsDataOutside] = useState<AppContextApi['paymentsDataOutside']>(defaultPaymentsDataOutside);
  const [rolePaymentsDataOutside, setRolePaymentsDataOutside] = useState<AppContextApi['rolePaymentsDataOutside']>([]);
  

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
    <AppContext.Provider value={{ testData, setTestData, GCIUnit, setGCIUnit, GCIValue, setGCIValue, stagingAmount, setStagingAmount, remittanceBankWireAmount, setRemittanceBankWireAmount,
      agentDataList, setAgentDataList, reasonValue, setReasonValue, reasonNote, setReasonNote, checkDataList, setCheckDataList, paymentsDataInside, setPaymentsDataInside, rolePaymentsDataInside, setRolePaymentsDataInside, paymentsDataOutside, setPaymentsDataOutside, rolePaymentsDataOutside, setRolePaymentsDataOutside }}>
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
