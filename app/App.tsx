import React from "@libs/react";
import { FormWizard } from "./components/form/Wizard";
import useApp from "./hooks/useApp";
import axios from "axios";
import { IRoleData } from "./models/type";
import { defaultDealData, defaultRemittanceChecks, APP_URL } from "./util";

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils,
  hooks,
}) => {
  const { Wizard } = Components;
  const { deal, roles } = models;
  const { setDealData, setRoleData, setRemittanceChecks } = useApp();

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
        payment_unit_type: 0,
        payment_value: 0,
        payment_calculated_from: 0,
      };
    });
    try {
      if (data !== null) {
        let tempDealData = data.dealData;
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
          setRoleData(tempRoleData);
        }

        let tempRemittanceChecks = data.remittanceChecks;
        if (setRemittanceChecks !== undefined) {
          setRemittanceChecks(tempRemittanceChecks);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    dataToContextAPI();
  }, []);

  return (
    <FormWizard
      Wizard={Wizard}
      hooks={hooks.wizard}
      utils={utils}
      models={models}
      api={api}
      Components={Components}
    />
  );
};

export default App;
