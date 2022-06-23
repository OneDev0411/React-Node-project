import React from '@libs/react'
import { AppContext } from '../index'
import { AppContextApi } from '../models/type';

const { useContext } = React;

const useApp = () => {
    const appContext = useContext<AppContextApi>(AppContext)

    // if (roleContext === undefined) {
    //     throw new Error('Toasts context undefined')
    // }
    
    return appContext;
}

export default useApp
