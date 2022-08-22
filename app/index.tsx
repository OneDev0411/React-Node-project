import React from "@libs/react";
import App from "./App";
import { createComponents } from "./core/utils/create-components";
import "./index.css";
import { AppContextApi } from "./models/type";
import { defaultDealData, defaultRemittanceChecks, defaultRole } from "./util";
const { createContext, useState } = React;

const defaultValue: AppContextApi = {
  dealData: defaultDealData,
  roleData: [],
  remittanceChecks: [],
  submitted: 0,
};

export const AppContext = createContext<AppContextApi>(defaultValue);

export const AppProvider: React.FC<any> = ({ children }) => {
  const [dealData, setDealData] =
    useState<AppContextApi["dealData"]>(defaultDealData);
  const [roleData, setRoleData] = useState<AppContextApi["roleData"]>([]);
  const [remittanceChecks, setRemittanceChecks] = useState<
    AppContextApi["remittanceChecks"]
  >(defaultRemittanceChecks);
  const [submitted, setSubmitted] = useState<AppContextApi["submitted"]>(0);

  return (
    <AppContext.Provider
      value={{
        dealData,
        setDealData,
        roleData,
        setRoleData,
        remittanceChecks,
        setRemittanceChecks,
        submitted,
        setSubmitted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default function Bootstrap({ Components, ...props }: EntryProps) {
  return (
    <AppProvider>
      <App Components={createComponents(Components)} {...props} />
    </AppProvider>
  );
}
