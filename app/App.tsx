import React from "@libs/react";
import { FormWizard } from "./components/form/Wizard";
import useApp from "./hooks/useApp";
import axios from "axios";
import { IRoleData } from "./models/type";

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils,
  hooks,
}) => {
  const { Wizard } = Components;
  const { deal, roles } = models;
  const { dealData, setDealData, roleData, setRoleData, setRemittanceChecks } =
    useApp();

  // push data to contextAPI from backend data
  const dataToContextAPI = async () => {
    let res = await axios.post("http://localhost:8081/total-read", {
      deal_id: deal.id,
    });
    let data = res.data.data;

    if (data !== null && data !== undefined) {
      let tempDealData = data.dealData;
      if (setDealData !== undefined) {
        setDealData(tempDealData);
      }
      let tempRoleData = data.roleData;
      if (setRoleData !== undefined) {
        let temp = roleData.slice();
        temp.push(
          tempRoleData.filter((item: IRoleData) => {
            let findItem = temp.find((ele: IRoleData) => {
              return ele.role_id == item.role_id;
            });
            return findItem;
          })
        );
        setRoleData(tempRoleData);
      }

      let tempRemittanceChecks = data.remittanceChecks;
      if (setRemittanceChecks !== undefined) {
        setRemittanceChecks(tempRemittanceChecks);
      }
    }
  };

  React.useEffect(() => {
    // set initial context agentData
    let agentRoles: IDealRole[] = roles.filter(
      (role: IDealRole) =>
        role.role === "BuyerAgent" ||
        role.role === "SellerAgent" ||
        role.role === "CoBuyerAgent" ||
        role.role === "CoSellerAgent"
    );

    if (setRoleData !== undefined) {
      setRoleData(
        agentRoles.map((agentRole: IDealRole) => {
          let {
            id,
            legal_full_name,
            role,
            commission_percentage,
            commission_dollar,
          } = agentRole;
          return {
            deal_id: deal.id,
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
        })
      );
    }

    dataToContextAPI();

    if (setDealData !== undefined) {
      setDealData({ ...dealData, deal_id: deal.id });
    }
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
