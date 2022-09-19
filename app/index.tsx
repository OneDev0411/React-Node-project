import React from "@libs/react";
import App from "./App";
import { createComponents } from "./core/utils/create-components";
import "./index.css";
import { AppContextApi } from "./models/type";
import { defaultDealData, defaultRemittanceChecks } from "./util";
const { createContext, useState } = React;

const defaultValue: AppContextApi = {
  dealData: defaultDealData,
  roleData: [],
  remittanceChecks: [],
  submitted: 0,
  financing: "",
  currentStep: 0,
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
  const [financing, setFinancing] = useState<AppContextApi["financing"]>("");
  const [currentStep, setCurrentStep] = useState<AppContextApi["currentStep"]>(0);

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
        financing,
        setFinancing,
        currentStep,
        setCurrentStep,
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
