import React from "@libs/react"
import axios from "axios"
import useApp from "./hooks/useApp"
import { AppContextApi, IRoleData, IPayment, IFeeData } from "./models/type"
import {
  defaultDealData,
  defaultRemittanceChecks,
  APP_URL,
  sortRole,
  defaultFeeData,
  defaultDealNumberData,
  defaultNoteData,
  defaultDocStatus,
  defaultTransData,
  defaultCreditData
} from "./util"
import { FormWizard } from "./components/form/Wizard"
import Loading from './components/Loading'

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils,
  hooks,
}) => {
  const { useEffect, useRef, useState } = React;
  
  const { Wizard } = Components;
  const { deal, roles } = models;
  const total_data: AppContextApi = useApp();
  const _totalData = useRef(total_data);
  const { 
    setDealData, 
    setRoleData, 
    setRemittanceChecks, 
    setInsidePayments, 
    setOutsidePayments, 
    submitted, 
    setSubmitted, 
    setFinancing, 
    currentStep, 
    setCurrentStep,
    setFeeData,
    setDealNumber,
    setNotes,
    setDocStatus,
    setTransCoordinator,
    setCreditData
  } = useApp();
  const enderType = deal.context.ender_type?.text;
  const dealType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? "Both" : deal.deal_type;
  const [ isNYC, setIsNYC ] = useState<boolean>(false)
  const [ isNevada, setIsNevada ] = useState<boolean>(false)
  const [ isFlorida, setIsFlorida ] = useState<boolean>(false)

  // push data from database to context
  const dataToContextAPI = async () => {
    let res = await axios.post(
      `${APP_URL}/rechat-commission-app-data-read`,
      {
        deal: deal.id,
      }
    );
    let data = res.data.data;
    // context initial agent data
    let agentRoles: IDealRole[] = roles.filter(
      (role: IDealRole) =>
        role.role === "BuyerAgent" ||
        role.role === "SellerAgent" ||
        role.role === "CoBuyerAgent" ||
        role.role === "CoSellerAgent"
    );
    let tempAgentRoles = agentRoles.map((agentRole: IDealRole) => {
      let {
        id,
        legal_full_name,
        role,
        commission_percentage,
        commission_dollar,
        user,
      } = agentRole;
      return {
        deal: deal.id,
        role_id: id,
        user_id: user ? user.id : null,
        agent_id: null,
        legal_full_name: legal_full_name,
        role: role,
        share_percent: commission_percentage,
        share_value: commission_dollar,
        note: "",
        address: ""
      };
    });
    tempAgentRoles.sort((a, b) => { 
      const key1 = a.role;
      const key2 = b.role;
      const diff = sortRole[key1 as keyof typeof sortRole] - sortRole[key2 as keyof typeof sortRole];
      return diff ? diff : a.legal_full_name.localeCompare(b.legal_full_name);
    });

    try {
      if (data !== null) { // in case of data exist in database
        let tempDealData = data.dealData;
        
        if (setSubmitted !== undefined) {
          if (tempDealData.deal && tempDealData.submitted !== null) {
            setSubmitted(Number(tempDealData.submitted));
          }
          else
            setSubmitted(-1);
        }
        if (setDealData !== undefined) {
          setDealData(tempDealData);
        }
        let tempRoleData = data.roleData;
        if (setRoleData !== undefined) {
          let temp: IRoleData[] = tempAgentRoles.filter((item: IRoleData) => {
            let findIndex = tempRoleData.findIndex((mem: IRoleData) => {
              return item.role_id == mem.role_id;
            });
            return findIndex == -1;
          });
          tempRoleData.map((item: IRoleData) => {
            let findIndex = tempAgentRoles.findIndex((mem: IRoleData) => {
              return item.role_id == mem.role_id;
            });
            item.share_percent = tempAgentRoles[findIndex].share_percent;
            item.share_value = tempAgentRoles[findIndex].share_value;
          });
          temp.map((item: IRoleData) => {
            tempRoleData.push(item);
          });
          const _roleData = tempRoleData.filter((item: IRoleData) => {
            if (dealType == "Both") {
              return item.role != null;
            }
            if (dealType == "Buying") {
              return (item.role == "BuyerAgent" ||
                        item.role == "CoBuyerAgent" ||
                        item.role == "BuyerReferral");
            }
            return (item.role == "SellerAgent" ||
                      item.role == "CoSellerAgent" ||
                      item.role == "SellerReferral");
          });
          _roleData.sort((a: IRoleData, b: IRoleData) => { 
            const key1 = a.role;
            const key2 = b.role;
            const diff = sortRole[key1 as keyof typeof sortRole] - sortRole[key2 as keyof typeof sortRole];
            return diff ? diff : a.legal_full_name.localeCompare(b.legal_full_name);
          });
          setRoleData(_roleData);
        }

        let tempRemittanceChecks = data.remittanceChecks;
        if (setRemittanceChecks !== undefined) {
          setRemittanceChecks(tempRemittanceChecks);
        }
        let tempInsidePayments = data.payments.filter((item: IPayment) => item.payment_side === "inside");
        let tempOutsidePayments = data.payments.filter((item: IPayment) => item.payment_side === "outside");
        if (setInsidePayments !== undefined) {
          setInsidePayments(tempInsidePayments);
        }
        if (setOutsidePayments !== undefined) {
          setOutsidePayments(tempOutsidePayments);
        }
        if (setCurrentStep !== undefined) {
          setCurrentStep(Number(tempDealData.current_step));
        }
        let tempFeeData = data.feeData
        if(setFeeData !== undefined) {
          setFeeData(tempFeeData)
        }
        if (setDealNumber !== undefined) {
          if (data.dealNumber) {
            let _defaultDealNumberData = JSON.parse(JSON.stringify(data.dealNumber))
            if (_defaultDealNumberData.deal === "") _defaultDealNumberData.deal = deal.id
            setDealNumber(_defaultDealNumberData)
          } else if (!data.dealNumber) {
            let _defaultDealNumberData = JSON.parse(JSON.stringify(defaultDealNumberData))
            _defaultDealNumberData.deal = deal.id
            setDealNumber(_defaultDealNumberData)
          }
        }
        if (setNotes !== undefined) {
          if (data.notes)
            setNotes(data.notes)
          else {
            let _defaultNoteData = JSON.parse(JSON.stringify(defaultNoteData))
            _defaultNoteData.deal = deal.id
            setNotes(_defaultNoteData)
          }
        }
        if (setDocStatus !== undefined) {
          if (data.docStatus) {
            setDocStatus(data.docStatuses)
          }
          else {
            let _defaultDocstatus = JSON.parse(JSON.stringify(defaultDocStatus))
            _defaultDocstatus.deal = deal.id
            setDocStatus(_defaultDocstatus)
          }
        }
        if (setTransCoordinator !== undefined) {
          if (data.transCoordinator){
            setTransCoordinator(data.transCoordinator)
          }
          else {
            let _defaultTransdata = JSON.parse(JSON.stringify(defaultTransData))
            _defaultTransdata.deal = deal.id
            setTransCoordinator(_defaultTransdata)
          }
        }
        if (setCreditData !== undefined) {
          if (data.creditData) {
            setCreditData(data.creditData)
          } else {
            let _defaultCreditData = JSON.parse(JSON.stringify(defaultCreditData))
            _defaultCreditData.deal = deal.id
            setCreditData(_defaultCreditData)
          }
        }
      } else { // in case of data doesn't exist in database, set default data
        if (setDealData !== undefined) {
          defaultDealData.deal = deal.id;
          setDealData(defaultDealData);
        }
        if (setRoleData !== undefined) {
          setRoleData(tempAgentRoles);
        }
        if (setFeeData !== undefined) {
          defaultFeeData[0].deal = deal.id
          setFeeData(defaultFeeData)
        }
        if (setRemittanceChecks !== undefined) {
          setRemittanceChecks(defaultRemittanceChecks);
        }
        if (setDealNumber !== undefined) {
          let _defaultDealNumberData = JSON.parse(JSON.stringify(defaultDealNumberData))
          _defaultDealNumberData.deal = deal.id
          setDealNumber(_defaultDealNumberData)
        }
        if (setNotes !== undefined) {
          let _defaultNoteData = JSON.parse(JSON.stringify(defaultNoteData))
          _defaultNoteData.deal = deal.id
          setNotes(_defaultNoteData)
        }
        if (setCurrentStep !== undefined) {
          setCurrentStep(defaultDealData.current_step);
        }
        if (setSubmitted !== undefined) 
          setSubmitted(-1);
        if (setDocStatus !== undefined) {
          let _defaultDocstatus = JSON.parse(JSON.stringify(defaultDocStatus))
          _defaultDocstatus.deal = deal.id
          setDocStatus(_defaultDocstatus)
        }
        if (setTransCoordinator !== undefined) {
          let _defaultTransdata = JSON.parse(JSON.stringify(defaultTransData))
          _defaultTransdata.deal = deal.id
          setTransCoordinator(_defaultTransdata)
        }
        if (setCreditData !== undefined) {
          let _defaultCreditData = JSON.parse(JSON.stringify(defaultCreditData))
          _defaultCreditData.deal = deal.id
          setCreditData(_defaultCreditData)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(utils.isBackOffice === true) {
      utils.isReview = false;
    }
    if (setFinancing !== undefined)
      setFinancing(deal.context.financing?.text);
    dataToContextAPI();
  }, []);

  useEffect(() => {
    let brand = deal.brand
    do {
      if (brand.id === "86fa6ed0-e8c3-11eb-bf2e-0271a4acc769") {
        setIsNYC(true)
        break
      } else if (brand.id === "3d2e2488-b54e-11ec-9d82-0271a4acc769") {
        if (setSubmitted) setSubmitted(1)
        setIsNevada(true)
        break
      } else if (brand.id === "6cc3250a-9fe1-11eb-baea-027d2d7e1395") {
        setIsFlorida(true)
        break
      }
      brand = brand.parent
    } while (brand.parent)
  }, [])

  // save data from context to database when app is closed
  useEffect(() => {
    if (submitted !== 0)
      return () => {
        const saveData = async () => {
          await axios.post(
            `${APP_URL}/rechat-commission-app-data-save`,
            {
              data: _totalData.current,
            }
          );
        }
        setTimeout(() => saveData(), 1000);
      }
    else
      return;
  }, [submitted]);

  useEffect(() => {
    if (submitted !== 0 && currentStep !== 0) {
      _totalData.current = total_data;
    }
  }, [total_data, submitted, currentStep]);

  if (submitted === 0 || currentStep === 0) {
    return (
      <Loading
        width={60}
        fill={'#0945EB'}
      />
    )
  } 
  else {
    return (
      <FormWizard
        Wizard={Wizard}
        hooks={hooks.wizard}
        utils={utils}
        models={models}
        api={api}
        Components={Components}
        isNYC={isNYC}
        isNevada={isNevada}
        isFlorida={isFlorida}
      />
    )
  }
};

export default App;
