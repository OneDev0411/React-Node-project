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
  const { setAgentDataList } = useApp();

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
    if (setAgentDataList !== undefined) {
      setAgentDataList(agentRoles.map((agentRole: IDealRole) => {
        let { id, legal_full_name, role } = agentRole;
        return {
          id, legal_full_name, role, sharePercent: 5, note: ""
        }
      }));
    }
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
