import React from '@libs/react'
import Ui from '@libs/material-ui'
import { FormWizard } from './components/form/Wizard'

const App: React.FC<EntryProps> = ({
  models,
  api,
  // api: { getDealContext, updateDealContext },
  Components,
  utils: { notify },
  hooks
}) => {
  const { Wizard } = Components;

  // const { updateDealContext, getDealContext } = api;
  // const wizard = useWizardContext();



  // console.log('context:', models.deal.context);

  // console.log('deal:', models.deal);

  // const updateContext = async () => {
  //   try {
  //     console.log('Saving')
  //     // await updateDealContext('financing_program', "changed")
  //     await updateDealContext('list_price', 1000)
  //     console.log('Saved')
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
  // console.log('context#####:', getDealContext('financing_program'));
  // console.log('context#####:', getDealContext('list_price'));
  return (
    // <>
    //   <Ui.Button variant="contained" color="primary" onClick={updateContext}>
    //     Update Deal Context
    //   </Ui.Button>
    //   {/* <p>PDoc value: {getDealContext('financing_program')?.text}</p> */}
    //   <p>ListPrice value: {getDealContext('list_price')?.text}</p>
    // </>
    <FormWizard Wizard={Wizard} hooks={hooks.wizard} models={models} api={api} Components={Components} />
  )
}

export default App;
