import React from '@libs/react'
import { FormWizard } from './components/form/Wizard'

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils: { notify },
  hooks
}) => {
  const { Wizard } = Components;

  return (
    <FormWizard Wizard={Wizard} hooks={hooks.wizard} models={models} api={api} Components={Components} />
  )
}

export default App;
