import UserInfoForm from './UserInfoForm';
import UserInfoCard from './UserInfoCard';
import { CardData, DefaultFormData, IStepProps } from '../models/type';

const Step2: React.FC<IStepProps> = ({ 
    subStep, 
    step,
    updateStep, 
    Ui,
    Components,
    React,
    models,
}) => {
    // const BaseProps = { React, Ui, Components };
    const { useEffect } = React;
    const { Grid, CircularProgress, Button } = Ui;
    const { RoleForm } = Components;
    const { deal } = models;
    const { QuestionWizard, QuestionSection, QuestionTitle } = Components.Wizard;

    useEffect(() => {
        setTimeout(() => {
            updateStep({ subStep: 1 });  
        }, 1000);  // TEST_CODE
    }, []);

    const cardData: CardData = {
        userName: "Mark Bloom",
        role: "Seller",
        phone: "(123)456 - 7890",
        email: "mbloom@gmail.com"
    }

    const user: IUser = {
        last_seen_at: null,
        cover_image_thumbnail_url: null,
        brand: null,
        id: null,
        email_confirmed: true,
        phone_confirmed: true,
        timezone: "",
        active_brand: null,
        agents: null,
        personal_room: null,
        user_type: 'Agent',
        first_name: null,
        last_name: null,
        display_name: '',
        email: '',
        phone_number: null,
        is_shadow: false,
        profile_image_url: null,
        cover_image_url: null,
        email_signature: null,
        access_token: '',
        refresh_token: '',
        facebook: undefined,
        twitter: undefined,
        linkedin: undefined,
        youtube: undefined,
        instagram: undefined,
        type: 'user',
        created_at: 0,
        updated_at: 0
    }

    const defaultRole: IDealRole = {
        agent: null,
        agent_brokerwolf_id: null,
        brokerwolf_contact_type: null,
        brokerwolf_id: null,
        brokerwolf_row_version: null,
        checklist: [],
        commission_dollar: null,
        commission_percentage: null,
        company_title: "",
        created_at: Number((new Date()).getTime()),
        created_by: null,
        deal: "",
        deleted_at: null,
        current_address: null,
        email: "",
        id: null,
        legal_first_name: "Remon",
        legal_full_name: "Aiman",
        legal_last_name: "",
        legal_middle_name: null,
        legal_prefix: "",
        mlsid: null,
        phone_number: "",
        role: "Seller",
        role_type: 'Person',
        type: "",
        updated_at: Number((new Date()).getTime()),
        user: user,
        brand: null,
    }

    // const defaultFormData: DefaultFormData = {
    //     role: 0,
    //     firstName: "Mark",
    //     lastName: "Bloom",
    //     email: "mbloom@gmail.com",
    //     phone: "(123)456 - 7890",
    //     companyTrust: "",
    //     currentAddress: "2972 Westheimer Rd. Santa Ana, Illinois 85486"
    // }

    // const handleOnUpsertRole = (e: any) => {
    //     e.preventDefault();
    // }

    // const handleOnClose = (e: any) => {
    //     e.preventDefault();
    // }

    // const handleClickFormButton = () => {

    // }

    return (
        <Grid container spacing={2} style={{ paddingBottom: 30 }}>
            <Grid item xs={12}>
                <QuestionWizard styles={{ marginBottom: -20 }}>
                    <QuestionSection>
                        <QuestionTitle>
                            Please confirm seller's details.
                        </QuestionTitle>
                    </QuestionSection>
                </QuestionWizard>
            </Grid>
            <Grid item xs={12}>
                {(step == 2 && subStep == 0) && <CircularProgress />}
                {(step == 2 && subStep == 1) && (
                    // <UserInfoForm 
                    //     handleClickButton={() => updateStep({ subStep: 2 })} 
                    //     defaultFormData={defaultFormData}
                    //     {...BaseProps}
                    // />
                    
                    // <RoleForm isOpen deal={deal} /> 
                    <RoleForm isOpen deal={deal} defaultRole={defaultRole} onClose={() => updateStep({ subStep: 2 })} title=" " form={{ legal_first_name: 'Rana',
                    legal_last_name: 'Soltani', role: "Buyer" }} /> 
                    // <RoleForm isOpen deal={deal} onClose={handleOnClose}  onUpsertRole={handleOnUpsertRole} /> 
                )}
                {(step > 2 || (step == 2 && subStep == 2)) && (
                    <>
                        <UserInfoCard 
                            Ui={Ui}
                            cardData={cardData}
                            step={2}
                        />
                        <Grid container className="UserInfo-Card">
                            <Grid item xs={12} style={{ textAlign: 'right' }} >
                            <Button style={{ color: 'black !important', border: 'solid #dbdbdb 1px', borderRadius: 5, marginRight: 10 }}>
                                Add Another Seller
                            </Button>
                            {step <= 2 && (
                                <Button variant="contained" onClick={() => updateStep({ step: 3, subStep: 0 })} style={{ backgroundColor: '#0fb78d', color: 'white' }}>
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

export default Step2;