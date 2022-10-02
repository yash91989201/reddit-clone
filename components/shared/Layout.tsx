import { Toaster } from 'react-hot-toast'
import Header from './Header'

interface LayoutType {
    children: JSX.Element
}

const Layout = ({ children }: LayoutType) => {
    return (
        <>
            <Toaster />
            <Header />
            {children}
        </>
    )
}

export default Layout