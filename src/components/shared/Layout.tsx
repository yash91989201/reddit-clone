import { Toaster } from 'react-hot-toast'
// custom components
import Header from './Header'

interface Props {
    children: JSX.Element
}

export default function Layout({ children }: Props): JSX.Element {

    return <>
        <Toaster />
        <Header />
        {children}
    </>

}
