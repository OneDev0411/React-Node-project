import React from '@libs/react'
import Ui from '@libs/material-ui'
import Step1 from './components/Step1'
import Step6 from './components/Step6'
import Step7 from './components/Step7'
import Step8 from './components/Step8'
import Step9 from './components/Step9'
import Step10 from './components/Step10'
import Step11 from './components/Step11'
import ConfirmContactInfo from './components/ConfirmContactInfo'
// import BuyerAttorneyDetail from './components/BuyerAttorneyDetail'
// import SellerAttorneyDetail from './components/SellerAttorneyDetail'
import { StepData } from './models/type'

const App: React.FC<EntryProps> = ({
  models,
  api,
  Components,
  utils: { notify }
}) => {
  const { useState, useEffect } = React;
  const BaseProps = { Components, notify, models, api };

  const [step, setStep] = useState<number>(0);
  const [subStep, setSubStep] = useState<number>(0);

  const { deal, roles } = models;
  const { RoleForm, RoleCard, ContactRoles } = Components;
  // console.log('context:', deal.context);

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

  return (
    <div style={{ padding: 10 }}>
      {/* <Ui.Box width="30%">
        <RoleCard
          role={roles[0]}
          readonly={false}
          onClickEdit={() => {}}
          onClickRemove={() => {}}
        />
      </Ui.Box> */}
      {step > 0 && <Step1 {...BaseProps} step={step} />}
      {step > 1 && <ConfirmContactInfo {...BaseProps} roleType="Seller" step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 2 && <ConfirmContactInfo {...BaseProps} roleType="Buyer" step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 3 && <ConfirmContactInfo {...BaseProps} roleType="BuyerPowerOfAttorney" step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 4 && <ConfirmContactInfo {...BaseProps} roleType="SellerPowerOfAttorney" step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 5 && <Step6 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 6 && <Step7 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 7 && <Step8 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 8 && <Step9 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 9 && <Step10 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 10 && <Step11 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {/* <Ui.Box width="30%" my={5}>
        <ContactRoles
          placeholder="Type client name"
          onSelectRole={(role: any) => console.log(role)}
        />
      </Ui.Box> */}
    </div>
  )
}

export default App;
