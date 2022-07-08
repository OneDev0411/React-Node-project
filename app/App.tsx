import React from '@libs/react'
import Ui from '@libs/material-ui'
import { FormWizard } from './components/form/Wizard'
import useApp from './hooks/useApp';
import axios from 'axios';
const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils,
  hooks
}) => {
  const { Wizard } = Components;
  const { deal, roles } = models;
  const { dealData ,setDealData, roleData, setRoleData, setRemittanceChecks } = useApp();

  // const { notifyOffice } = utils;
  // const { testData, setTestData } = useApp();
  // React.useEffect(() => {
  //   if (setTestData !== undefined) {
  //     setTestData("puhahaha");
  //   }
  // }, []);

  const dataToContextAPI = (data: any) => {
    let tempDealData = data.dealData;
    delete tempDealData.id;
    delete tempDealData.createdAt;
    delete tempDealData.updatedAt;
    console.log('dealData', tempDealData);
    if(setDealData !== undefined) setDealData(tempDealData);
    let tempRoleData = data.roleData;
    for(let i = 0; i < tempRoleData.length; i++){
      delete tempRoleData[i].id;
      delete tempRoleData[i].createdAt;
      delete tempRoleData[i].updatedAt;
    }
    console.log('tempRoleData', tempRoleData);
    if(setRoleData !== undefined) setRoleData(tempRoleData);

    let tempRemittanceChecks = data.remittanceChecks;
    for(let i = 0; i < tempRemittanceChecks.length; i++){
      delete tempRemittanceChecks[i].id;
      delete tempRemittanceChecks[i].createdAt;
      delete tempRemittanceChecks[i].updatedAt;
    }
    console.log('tempRemittanceChecks', tempRemittanceChecks);
    if(setRemittanceChecks !== undefined) setRemittanceChecks(tempRemittanceChecks);

  }

  React.useEffect(() => {
    axios.post("http://localhost:8081/total-read", {deal_id: deal.id}).then((res) => {
        console.log('reading total data', res.data);
        let data = res.data.data;
        dataToContextAPI(data);
    });
  }, []);

  React.useEffect(() => {

    console.log('deal##########:', roles);
    // set initial context agentData
    let agentRoles: IDealRole[] = roles.filter((role: IDealRole) => role.role === "BuyerAgent" || role.role === "SellerAgent" || role.role === "CoBuyerAgent" || role.role === "CoSellerAgent");
    if (setRoleData !== undefined) {
      setRoleData(agentRoles.map((agentRole: IDealRole) => {
        let { id, legal_full_name, role, commission_percentage, commission_dollar } = agentRole;
        let result: any;
        let findIndex = roleData.findIndex((item) => {
          return item.role_id == id;
        });
        if(findIndex !== -1){ 
          result = {};
        }
        else result = {deal_id: deal.id, role_id: id, legal_full_name: legal_full_name, role: role, share_percent: commission_percentage, share_value: commission_dollar, note: "", payment_unit_type: 0, payment_value: 0, payment_calculated_from: 0};
        return result; 
      }));
    }
    
    if(setDealData !== undefined) setDealData({...dealData, deal_id: deal.id});
    // console.log('agentRoles:', agentRoles);
    // console.log('context:', deal.context);
    // async function doSomething() {
    //   if (add !== undefined) {
    //     await add();
    //   }
    //   console.log('testData:', testData);
    // }
    // doSomething();
  }, []);

  return (
    // <Ui.Button
    //   variant="contained"
    //   color="primary"
    //   onClick={() => notifyOffice('Please check this comment')}
    // >
    //   Notify Admin
    // </Ui.Button>
    // <div>
    //   Test
    // </div>
    // <>
      // <Ui.Button
      //   variant="contained"
      //   color="primary"
      //   onClick={() => console.log("$$$$$testData:", testData)}
      // >
      //   GetData
      // </Ui.Button>
    <FormWizard Wizard={Wizard} hooks={hooks.wizard} utils={utils} models={models} api={api} Components={Components} />
    // </>
  )
}

export default App;
