import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSignUpEmailPassword } from '@nhost/nextjs'
// custom component
import Spinner from 'components/shared/Spinner'

interface CredentialsInput {
    username: string,
    email: string,
    password: string
}

export default function SignIn(): JSX.Element {

    const [credentials, setCredentials] = useState<CredentialsInput>({
        username: '',
        email: '',
        password: '',
    })
    const router = useRouter()

    const { signUpEmailPassword, isLoading, isSuccess, needsEmailVerification, isError, error } =
        useSignUpEmailPassword()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await signUpEmailPassword(credentials.email, credentials.password, { displayName: credentials.username })
        console.log(isSuccess)
        if (isSuccess)
            router.push('/sign-in')
    }

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials((prevVal) => {
            return { ...prevVal, [event.target.name]: event.target.value }
        })
    }

    if (isSuccess) {
        router.push('/')
    }

    const disableForm = (isLoading || needsEmailVerification)

    return <div className='flex justify-center items-center w-full h-screen'>
        <Head>
            <title>Signup | Reddit 2.0</title>
            <meta name="description" content="Signup for our new Reddit 2.0 " />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div
            className='flex flex-col items-center p-6 space-y-6 bg-white rounded'
        >
            <div className='relative w-16 aspect-square'>
                <Image
                    src='/assets/reddit_logo.png'
                    alt='reddit logo'
                    layout='fill'
                />
            </div>
            <form
                className='flex flex-col space-y-8'
                onSubmit={(e) => handleSubmit(e)}
            >
                <div className='flex flex-col space-y-3'>
                    <input
                        type='text'
                        name='username'
                        className='p-2 rounded border disabled:cursor-not-allowed'
                        placeholder='Username'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                        value={credentials.username}
                        disabled={disableForm}
                        required
                    />
                    <input
                        type='email'
                        name='email'
                        className='p-2 rounded border disabled:cursor-not-allowed'
                        placeholder='Email'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                        value={credentials.email}
                        disabled={disableForm}
                        required
                    />
                    <input
                        type='password'
                        name='password'
                        className='p-2 rounded border disabled:cursor-not-allowed'
                        placeholder='Password'
                        value={credentials.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                        disabled={disableForm}
                        required
                    />
                </div>

                <button
                    type='submit'
                    className='p-1 font-medium text-white rounded-full disabled:cursor-not-allowed bg-reddit-col'
                    disabled={disableForm}
                >
                    {isLoading ? <Spinner /> : 'Sign up'}
                </button>

                {isError ? <p >{error?.message}</p> : null}
            </form>

            <p className='flex items-center space-x-3'>
                <span>Already a user?</span>
                <Link href='/sign-in'>
                    <a className='text-blue-500 underline'>Sign in</a>
                </Link>
            </p>
        </div>
    </div>

}


