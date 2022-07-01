import React from '@libs/react'
import { IQuestionProps } from '../../../../models/type';

const StartQuestion: React.FC<IQuestionProps> = ({
    Wizard,
    hooks: { useWizardContext }
}) => {
    const { useEffect } = React;
    const { QuestionSection, QuestionTitle } = Wizard;
    const wizard = useWizardContext()

    // mockup loading, need to remove after the backend is impplemented
    useEffect(() => {
        // wizard.next();
        wizard.goto(11);
        // wizard.setLoading(true);
        // setTimeout(() => {
            // wizard.setLoading(false);
            // wizard.next();
        // }, 100);
    }, []);

    return (
        <QuestionSection>
            <QuestionTitle>
                Awesome🎉 let's get a few questions answered and get you paid.
            </QuestionTitle>
        </QuestionSection>
    )
}

export default StartQuestion;