import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuthenticationStatus, useSignOut } from "@nhost/nextjs"
// custom components
import Spinner from "./Spinner"

// import icons
import {
    HiMenu,
    HiSearch,
    HiChevronDown,
    HiHome,
    HiOutlineSparkles,
    HiOutlineBell,
    HiOutlineGlobe,
    HiOutlineVideoCamera,
    HiOutlineChat,
    HiPlus,
    HiOutlineSpeakerphone
} from "react-icons/hi"
import { FcReddit } from "react-icons/fc"

const Header = () => {
    // const [sidebar, setSidebar] = useState(true)
    const { isLoading, isAuthenticated } = useAuthenticationStatus()
    const { signOut } = useSignOut()
    return (
        <header className="sticky top-0 z-50 flex px-4 py-2 bg-white shadow-md">
            {/* logo */}
            <Link href="/">
                <a className="inline-flex items-center space-x-3">
                    <div className="relative w-8 aspect-square">
                        <Image
                            src="/assets/reddit_logo.png"
                            alt="reddit-logo"
                            layout="fill"
                        />
                    </div>
                    <h3 className="hidden text-2xl font-semibold sm:block ">Reddit</h3>

                </a>
            </Link>
            <div className="flex items-center mx-3 px-2 xl:min-w-[240px] bg-gray-200 rounded">
                <HiHome className="w-6 aspect-square" />
                <p className="flex-1 hidden mx-2 lg:inline">Home</p>
                <HiChevronDown className="w-4 aspect-square" />
            </div>
            <form className="relative mx-3 flex items-center flex-1 space-x-3 overflow-hidden text-gray-400 border border-gray-200 rounded-md outline-none">
                <input type="text" placeholder="Search Reddit" className="w-full h-full pl-12 focus:bg-gray-200" />
                <HiSearch className="absolute w-5 text-gray-400 aspect-square" />
                <button type="submit" hidden />
            </form>
            <div className="hidden mx-3  md:inline-flex items-center space-x-3">
                <HiOutlineSparkles className="icon" />
                <HiOutlineGlobe className="icon" />
                <HiOutlineVideoCamera className="icon" />
                <hr className="h-10 border border-gray-100 " />
                <HiOutlineChat className="icon" />
                <HiOutlineBell className="icon" />
                <HiPlus className="icon" />
                <HiOutlineSpeakerphone className="icon" />
            </div>
            <div className=" inline-flex items-center md:hidden">
                <HiMenu className="icon " />
            </div>
            {/* TODO - ADD SIDEBAR NAVIGATION */}
            {
                isAuthenticated ?
                    <button
                        className="ml-2 px-2 inline-flex items-center border rounded-md space-x-2 active:bg-gray-200 active:border-none"
                        onClick={() => { signOut() }}
                    >
                        <FcReddit className="text-lg" />
                        {isLoading ? <Spinner /> : <p className="hidden md:block text-sm text-gray-400">SignOut</p>}
                    </button> :
                    <Link href="/sign-in">
                        <a className="ml-2 px-2 inline-flex items-center border rounded-md space-x-2 active:bg-gray-200 active:border-none">
                            <FcReddit className="text-lg" />
                            {isLoading ? <Spinner /> : <p className="hidden md:block text-sm text-gray-400">SignIn</p>}
                        </a>
                    </Link>
            }
        </header>
    )
}

export default Header
