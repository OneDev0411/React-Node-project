import React from '@libs/react'
import Ui from '@libs/material-ui'
import StartNotification from './components/StartNotification'
import FinancingProgram from './components/FinancingProgram'
import ListingInfo from './components/ListingInfo'
import GrossCommission from './components/GrossCommission'
import GCI2DE from './components/GCI2DE'
import GCISplit from './components/GCISplit'
import FinancingTransaction from './components/FinancingTransaction'
import ConfirmContactInfo from './components/ConfirmContactInfo'
import { StepData } from './models/type'

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils: { notify }
}) => {
  const { useState, useEffect } = React;
  const BaseProps = { Components, notify, models, api };
  const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

  const [step, setStep] = useState<number>(0);
  const [subStep, setSubStep] = useState<number>(0);
  const [GCIUnit, setGCIUnit] = useState<string>("");

  const { deal, roles } = models;

  // const { updateDealContext, getDealContext } = api;

  console.log('deal:', deal);

  useEffect(() => {
    setTimeout(() => {
      setStep(1);
    }, 100); // TEST_CODE

    setTimeout(() => {
      setStep(2); // TEST_CODE
    }, 200);  // TEST_CODE
  }, []);

  const updateStep = (param: StepData) => {
    if (param.step !== undefined) {
      setStep(param.step);
    }
    if (param.subStep !== undefined) {
      setSubStep(param.subStep);
    }
  }

  // const updateContext = async () => {
  //   try {
  //     console.log('Saving')
  //     // await updateDealContext('full_address', "Testtesttest")
  //     await updateDealContext('pdoc', new Date().getTime())
  //     console.log('Saved')
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
  // console.log('###########', getDealContext('full_address')?.text);

  return (
      // {/* <p>PDoc value: {getDealContext('full_address')?.text}</p> */}
      // {/* <p>PDoc value: {getDealContext('pdoc')?.text}</p>
      // <Ui.Button variant="contained" color="primary" onClick={updateContext}>
      //   Update Deal Context
      // </Ui.Button> */}
    <div style={{ padding: 10 }}>
      {step > 0 && <StartNotification {...BaseProps} step={step} />}
      {step > 1 && <ConfirmContactInfo {...BaseProps} roleType="Seller" step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 2 && <ConfirmContactInfo {...BaseProps} roleType="Buyer" step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 3 && <ConfirmContactInfo {...BaseProps} roleType="BuyerPowerOfAttorney" step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 4 && <ConfirmContactInfo {...BaseProps} roleType="SellerPowerOfAttorney" step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 5 && <FinancingTransaction {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 6 && <FinancingProgram {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 7 && <ListingInfo {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 8 && <GrossCommission {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} GCIUnit={GCIUnit} setGCIUnit={setGCIUnit} />}
      {step > 9 && <GCI2DE {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} GCIUnit={GCIUnit} />}
      {step > 10 && <GCISplit {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
    </div>
  )
}

export default App;
