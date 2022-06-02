import UserInfoForm from './UserInfoForm';
import UserInfoCard from './UserInfoCard';
import { CardData, IStepProps } from '../models/type';

const Step3: React.FC<IStepProps> = ({ 
    subStep, 
    step,
    updateStep, 
    Ui,
    Components,
    React,
    models,
}) => {
    const BaseProps = { React, Ui, Components };
    const { useEffect } = React;
    const { Grid, CircularProgress, Button } = Ui;
    const { RoleForm } = Components;
    const { deal } = models;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;
    
    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 });  
        }, 1000);
    }, []);

    const cardData: CardData = {
        userName: "Jim Doe",
        role: "Buyer",
        phone: "(123)456 - 7890",
        email: "jdoe@gmail.com"
    };

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Please confirm buyer's details.
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {(step == 3 && subStep == 0) && <CircularProgress />}
                {(step == 3 && subStep == 1) && (
                    // <UserInfoForm 
                    //     handleClickButton={() => updateStep({ subStep: 2 })} 
                    //     defaultFormData={{
                    //         role: 1,
                    //         firstName: "Jim",
                    //         lastName: "Doe",
                    //         email: "jdoe@gmail.com",
                    //         phone: "",
                    //         companyTrust: "",
                    //         currentAddress: "2972 Westheimer Rd. Santa Ana, Illinois 85486"
                    //     }}
                    //     {...BaseProps}
                    // />
                    <RoleForm isOpen deal={deal} onClose={() => updateStep({ subStep: 2 })} /> 
                )}
                {(step > 3 || (step == 3 && subStep == 2)) && (
                    <>
                        <UserInfoCard 
                            {...BaseProps} 
                            cardData={cardData}
                            step={3}
                        />
                        <Grid container className="UserInfo-Card">
                                <Grid item xs={12} style={{ textAlign: 'right' }} >
                                <Button style={{ color: 'black !important', borderColor: '#dbdbdb !important', marginRight: 10 }}>
                                    Add Another Seller
                                </Button>
                                {step <= 3 && (
                                    <Button variant="contained" onClick={() => updateStep({ step: 4, subStep: 0 })} style={{ backgroundColor: '#0fb78d', color: 'white' }}>
                                        Looks Good, Next
                                    </Button>
                                )}
                                </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </Grid>
    )
}

export default Step3;