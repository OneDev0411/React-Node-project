import React from '@libs/react'
import Ui from '@libs/material-ui'
import { FormWizard } from './components/form/Wizard'
import useApp from './hooks/useApp';

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils,
  hooks
}) => {
  const { Wizard } = Components;
  const { deal, roles } = models;
  const { dealData ,setDealData, setRoleData, setRemittanceChecks } = useApp();

  // const { notifyOffice } = utils;
  // const { testData, setTestData } = useApp();
  // React.useEffect(() => {
  //   if (setTestData !== undefined) {
  //     setTestData("puhahaha");
  //   }
  // }, []);


  React.useEffect(() => {
    console.log('deal##########:', deal);
    // set initial context agentData
    let agentRoles: IDealRole[] = roles.filter((role: IDealRole) => role.role === "BuyerAgent" || role.role === "SellerAgent" || role.role === "CoBuyerAgent" || role.role === "CoSellerAgent");
    if (setRoleData !== undefined) {
      setRoleData(agentRoles.map((agentRole: IDealRole) => {
        let { id, legal_full_name, role } = agentRole;
        return {
          deal_id: deal.id, role_id: id, legal_full_name: legal_full_name, role: role, share_percent: 0, share_value: 0, note: "", payment_unit_type: 0, payment_value: 0, payment_calculated_from: 0
        }
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
