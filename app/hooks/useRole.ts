import React from '@libs/react'
import { RoleContext } from '../index'
import { RoleContextApi } from '../models/type';
const { useContext } = React;

const useRole = () => {
    const roleContext = useContext<Partial<RoleContextApi>>(RoleContext)

    return roleContext;  
}

export default useRole
