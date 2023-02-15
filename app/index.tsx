import React from "@libs/react"
import App from "./App"
import { createComponents } from "./core/utils/create-components"
import { AppContextApi } from "./models/type"
import { 
  defaultDealData, 
  defaultDealNumberData, 
  defaultRemittanceChecks, 
  defaultNoteData, 
  defaultDocStatus, 
  defaultTransData 
} from "./util"
import "./index.css"

const { createContext, useState } = React;

const defaultValue: AppContextApi = {
  dealData: defaultDealData,
  roleData: [],
  remittanceChecks: [],
  insidePayments: [],
  outsidePayments: [],
  submitted: 0,
  financing: "",
  currentStep: 0,
  feeData: [],
  dealNumber: defaultDealNumberData,
  notes: defaultNoteData,
  docStatus: defaultDocStatus,
  transCoordinator: defaultTransData
};

export const AppContext = createContext<AppContextApi>(defaultValue);

export const AppProvider: React.FC<any> = ({ children }) => {
  const [dealData, setDealData] =
    useState<AppContextApi["dealData"]>(defaultDealData);
  const [roleData, setRoleData] = useState<AppContextApi["roleData"]>([]);
  const [remittanceChecks, setRemittanceChecks] = useState<
    AppContextApi["remittanceChecks"]
  >(defaultRemittanceChecks);
  const [insidePayments, setInsidePayments] = useState<AppContextApi["insidePayments"]>([]);
  const [outsidePayments, setOutsidePayments] = useState<AppContextApi["outsidePayments"]>([]);
  const [submitted, setSubmitted] = useState<AppContextApi["submitted"]>(0);
  const [financing, setFinancing] = useState<AppContextApi["financing"]>("");
  const [currentStep, setCurrentStep] = useState<AppContextApi["currentStep"]>(0);
  const [feeData, setFeeData] = useState<AppContextApi["feeData"]>([]);
  const [dealNumber, setDealNumber] = useState<AppContextApi["dealNumber"]>(defaultDealNumberData)
  const [notes, setNotes] = useState<AppContextApi["notes"]>(defaultNoteData)
  const [docStatus, setDocStatus] = useState<AppContextApi["docStatus"]>(defaultDocStatus)
  const [transCoordinator, setTransCoordinator] = useState<AppContextApi["transCoordinator"]>(defaultTransData)

  return (
    <AppContext.Provider
      value={{
        dealData,
        setDealData,
        roleData,
        setRoleData,
        remittanceChecks,
        setRemittanceChecks,
        insidePayments,
        setInsidePayments,
        outsidePayments,
        setOutsidePayments,
        submitted,
        setSubmitted,
        financing,
        setFinancing,
        currentStep,
        setCurrentStep,
        feeData,
        setFeeData,
        dealNumber,
        setDealNumber,
        notes,
        setNotes,
        docStatus,
        setDocStatus,
        transCoordinator,
        setTransCoordinator
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
