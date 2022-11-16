import Link from "next/link";
import Image from "next/image";
import { useAuthenticationStatus, useSignOut } from "@nhost/nextjs";
// import icons
import { RiSearchLine } from "react-icons/ri";
import {
  HiMenu,
  HiChevronDown,
  HiHome,
  HiOutlineSparkles,
  HiOutlineBell,
  HiOutlineGlobe,
  HiOutlineVideoCamera,
  HiOutlineChat,
  HiPlus,
  HiOutlineSpeakerphone,
} from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { FcReddit } from "react-icons/fc";
// custom components
import Spinner from "./Spinner";

export default function Header(): JSX.Element {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const { signOut } = useSignOut();

  return (
    <header className="flex sticky top-0 z-50 py-2 px-4 bg-white shadow-md">
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
          <h3 className="hidden text-2xl font-semibold sm:block">Reddit</h3>
        </a>
      </Link>
      <div className="hidden items-center px-2 mx-3 bg-gray-200 rounded sm:flex xl:min-w-[240px]">
        <HiHome className="w-6 aspect-square" />
        <p className="hidden flex-1 mx-2 lg:inline">Home</p>
        <HiChevronDown className="w-4 aspect-square" />
      </div>
      <form className="flex overflow-hidden relative flex-1 items-center mx-3 space-x-3 text-gray-400 rounded-full border border-gray-200 outline-none">
        <input
          type="text"
          placeholder="Search Reddit"
          className="pl-12 w-full h-full text-sm focus:bg-gray-200"
        />
        <RiSearchLine className="absolute w-5 text-2xl text-gray-400 aspect-square" />
        <button type="submit" hidden />
      </form>
      <div className="hidden items-center mx-3 space-x-3 md:inline-flex">
        <HiOutlineSparkles className="icon" />
        <HiOutlineGlobe className="icon" />
        <HiOutlineVideoCamera className="icon" />
        <hr className="h-10 border border-gray-200" />
        <HiOutlineChat className="icon" />
        <HiOutlineBell className="icon" />
        <HiPlus className="icon" />
        <HiOutlineSpeakerphone className="icon" />
      </div>
      <div className="inline-flex items-center md:hidden">
        <HiMenu className="icon" />
      </div>
      {/* TODO - ADD SIDEBAR NAVIGATION */}
      {isAuthenticated ? (
        <button
          className="inline-flex items-center px-2 ml-2 space-x-2 rounded-md border active:bg-gray-200 active:border-none"
          onClick={() => {
            signOut();
          }}
        >
          <FiLogOut className="text-lg text-reddit-col" />
          {isLoading ? (
            <Spinner />
          ) : (
            <p className="hidden text-sm text-gray-400 md:block">Sign Out</p>
          )}
        </button>
      ) : (
        <Link href="/sign-in">
          <a className="inline-flex items-center px-2 ml-2 space-x-2 rounded-md border active:bg-gray-200 active:border-none">
            <FcReddit className="text-lg" />
            {isLoading ? (
              <Spinner />
            ) : (
              <p className="hidden text-sm text-gray-400 md:block">Sign In</p>
            )}
          </a>
        </Link>
      )}
    </header>
  );
}
