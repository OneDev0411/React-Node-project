import Ui from '@libs/material-ui'
import React from '@libs/react'
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import Step6 from './components/Step6';
import Step7 from './components/Step7';
import Step8 from './components/Step8';
import Step9 from './components/Step9';
import Step10 from './components/Step10';
import Step11 from './components/Step11';
import { StepData } from './models/type';

const App: React.FC<EntryProps> = ({
  models,
  api: { getDealContext, updateDealContext },
  Components,
  utils: { notify }
}) => {
  const { useState, useEffect } = React;
  const { RoleForm } = Components;
  const { deal } = models;
  const BaseProps = { React, Ui, Components, notify, models };

  const [step, setStep] = useState<number>(0);
  const [subStep, setSubStep] = useState<number>(0);
  // const { Button, Divider, Box } = Ui;
  // const [counter, setCounter] = React.useState<number>(0)

  // const updateContext = async () => {
  //   try {
  //     console.log('Saving')
  //     await updateDealContext('pdoc', new Date().getTime())
  //     console.log('Saved')
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
  useEffect(() => {
    setTimeout(() => {
      setStep(1);
    }, 1000); // TEST_CODE

    setTimeout(() => {
      setStep(2);
    }, 2000);  // TEST_CODE
  }, []);

  const updateStep = (param: StepData) => {
    if(param.step !== undefined) {
      setStep(param.step);
    }
    if(param.subStep !== undefined) { 
      setSubStep(param.subStep);
    }
  }

  return (
    <div style={{ padding: 10 }}>
      {step > 0 && <Step1 {...BaseProps} step={step}/>}
      {step > 1 && <Step2 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 2 && <Step3 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 3 && <Step4 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 4 && <Step5 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 5 && <Step6 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 6 && <Step7 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 7 && <Step8 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 8 && <Step9 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 9 && <Step10 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {step > 10 && <Step11 {...BaseProps} step={step} subStep={subStep} updateStep={(param: StepData) => updateStep(param)} />}
      {/* <h3>{deal.title}</h3>
      <p>PDoc value: {getDealContext('pdoc')?.text}</p>

      <Button variant="contained" color="primary" onClick={updateContext}>
        Update Deal Context
      </Button>

      <Box my={2}>
        <Divider />
      </Box>

      <p
        style={{
          userSelect: 'none'
        }}
        onClick={() => setCounter(v => v + 1)}
      >
        Counter {counter}
      </p>

      <Box my={2}>
        <Divider />
      </Box>

      <RoleForm isOpen title="Create Role" deal={deal} onClose={() => {}} /> */}
      {/* <RoleForm isOpen title="Create Role" deal={deal} onClose={() => {}} /> */}
    </div>
  )
}

export default App;
