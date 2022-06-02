import React from '@libs/react'

const { createContext, useState } = React;


// NEED_TO_UPDATE_THIS_CODE
export const TestContext = createContext<any>({ test: "__test" })
// export const RoleContext = createContext<RoleContextApi>(undefined)

export const TestProvider: React.FC<any> = ({ children }) => {
    return (
        <TestContext.Provider value={{ test: "test" }}>
            {children}
        </TestContext.Provider>
    )
}
