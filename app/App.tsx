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
  // const { notifyOffice } = utils;
  // const { add, testData, test } = useApp();
  // React.useEffect(() => {
  //   async function doSomething() {
  //     if (add !== undefined) {
  //       await add();
  //     }
  //     console.log('testData:', testData);
  //   }
  //   doSomething();
  // }, []);

  return (
    // <Ui.Button
    //   variant="contained"
    //   color="primary"
    //   onClick={() => notifyOffice('Please check this comment')}
    // >
    //   Notify Admin
    // </Ui.Button>
    // <div>
    // {/* Test */}
    // {/* </div> */}
    // <>
    //   <Ui.Button
    //     variant="contained"
    //     color="primary"
    //     onClick={() => console.log("$$$$$testData:", testData)}
    //   >
    //     GetData
    //   </Ui.Button>
    <FormWizard Wizard={Wizard} hooks={hooks.wizard} utils={utils} models={models} api={api} Components={Components} />
    // </>
  )
}

export default App;
