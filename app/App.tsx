import React from '@libs/react'
import Ui from '@libs/material-ui'
import { FormWizard } from './components/form/Wizard'

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils,
  hooks
}) => {
  const { Wizard } = Components;
  // const { notifyOffice } = utils;

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
    <FormWizard Wizard={Wizard} hooks={hooks.wizard} utils={utils} models={models} api={api} Components={Components} />
  )
}

export default App;
