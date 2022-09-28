import React from 'react'
import Header from './Header'

interface LayoutType {
    children: JSX.Element
}

const Layout = ({ children }: LayoutType) => {
    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default Layout