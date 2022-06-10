import React from '@libs/react'
import { FormWizard } from './components/form/Wizard'

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils,
  hooks
}) => {
  const { Wizard } = Components;

  return (
    <FormWizard Wizard={Wizard} hooks={hooks.wizard} utils={utils} models={models} api={api} Components={Components} />
  )
}

export default App;
