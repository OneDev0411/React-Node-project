import React from '@libs/react'
import Step1 from './components/Step1'
import Step4 from './components/Step4'
import Step5 from './components/Step5'
import Step6 from './components/Step6'
import Step7 from './components/Step7'
import Step8 from './components/Step8'
import Step9 from './components/Step9'
import Step10 from './components/Step10'
import Step11 from './components/Step11'
import SellerDetail from './components/SellerDetail'
import { StepData } from './models/type'
import BuyerDetail from './components/BuyerDetail'

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

  useEffect(() => {
    setTimeout(() => {
      setStep(1);
    }, 100); // TEST_CODE

    setTimeout(() => {
      setStep(2);
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
      {step > 0 && <Step1 {...BaseProps} step={step} />}
      {step > 1 && <SellerDetail {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 2 && <BuyerDetail {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 3 && <Step4 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 4 && <Step5 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 5 && <Step6 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 6 && <Step7 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 7 && <Step8 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 8 && <Step9 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 9 && <Step10 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 10 && <Step11 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
    </div>
  )
}

export default App;
