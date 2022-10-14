import React from "@libs/react";
import { FormWizard } from "./components/form/Wizard";
import axios from "axios";
import { AppContextApi, IRoleData, IPayment } from "./models/type";
import useApp from "./hooks/useApp";
import { defaultDealData, defaultRemittanceChecks, APP_URL } from "./util";
import Loading from './components/Loading';

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils,
  hooks,
}) => {
  const { useEffect, useRef } = React;
  const { Wizard } = Components;
  const { deal, roles } = models;
  const total_data: AppContextApi = useApp();
  const _totalData = useRef(total_data);
  const { setDealData, setRoleData, setRemittanceChecks, setInsidePayments, setOutsidePayments, submitted, setSubmitted, setFinancing, currentStep, setCurrentStep } = useApp();
  const enderType = deal.context.ender_type?.text;
  const dealType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? "Both" : deal.deal_type;
  const sortRole = {
    BuyerAgent: 1,
    CoBuyerAgent: 2,
    BuyerReferral: 3,
    SellerAgent: 4,
    CoSellerAgent: 5,
    SellerReferral: 6,
  };

  // push data to global state from backend data by using contextAPI
  const dataToContextAPI = async () => {
    let res = await axios.post(
      `${APP_URL}/rechat-commission-app-data-read`,
      {
        deal: deal.id,
      }
    );
    let data = res.data.data;
    // set initial context agentData
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
      } = agentRole;
      return {
        deal: deal.id,
        role_id: id,
        legal_full_name: legal_full_name,
        role: role,
        share_percent: commission_percentage,
        share_value: commission_dollar,
        note: "",
      };
    });
    tempAgentRoles.sort((a, b) => { 
      const key1 = a.role;
      const key2 = b.role;
      return sortRole[key1 as keyof typeof sortRole] - sortRole[key2 as keyof typeof sortRole];
    });

    try {
      if (data !== null) {
        let tempDealData = data.dealData;

        if (setSubmitted !== undefined) {
          if (tempDealData.deal && tempDealData.submitted !== null)
            setSubmitted(Number(tempDealData.submitted));
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
            return sortRole[key1 as keyof typeof sortRole] - sortRole[key2 as keyof typeof sortRole];
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
      } else {
        if (setDealData !== undefined) {
          defaultDealData.deal = deal.id;
          setDealData(defaultDealData);
        }
        if (setRoleData !== undefined) {
          setRoleData(tempAgentRoles);
        }
        if (setRemittanceChecks !== undefined) {
          setRemittanceChecks(defaultRemittanceChecks);
        }
        if (setCurrentStep !== undefined) {
          setCurrentStep(defaultDealData.current_step);
        }
        if (setSubmitted !== undefined) 
          setSubmitted(-1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (setFinancing !== undefined)
      setFinancing(deal.context.financing?.text);
    dataToContextAPI();
  }, []);

  useEffect(() => {
    if (submitted !== 0 && !utils.isBackOffice)
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
      />
    )
  }
};

export default App;
