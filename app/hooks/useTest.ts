import React from '@libs/react'
import { TestContext } from '../contexts/TestContext'

const { useContext, useState } = React;

const useTest = () => {
    // const [roles, setRoles] = useState<IDealRole[]>([]);

    const roleContext = useContext(TestContext)

    // if (roleContext === undefined) {
    //     throw new Error('Toasts context undefined')
    // }
    
    return roleContext;  
}

export default useTest
