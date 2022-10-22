import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSignInEmailPassword } from '@nhost/nextjs'
// custom component
import Spinner from 'components/shared/Spinner'

interface CredentialsInput {
    email: string,
    password: string
}

export default function SignIn(): JSX.Element {

    const [credentials, setCredentials] = useState<CredentialsInput>({
        email: '',
        password: ''
    })
    const router = useRouter()

    const { signInEmailPassword, isLoading, isSuccess, needsEmailVerification, isError, error } =
        useSignInEmailPassword()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        await signInEmailPassword(credentials.email, credentials.password)
        console.log(isSuccess);

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

    return <div className='w-full h-screen flex justify-center items-center'>
        <Head>
            <title>Signin | Reddit 2.0</title>
            <meta name="description" content="Signin now and be a part of Reddit 2.0 " />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div
            className='p-6 flex flex-col items-center rounded bg-white space-y-6'
        >
            <div className='relative w-16 aspect-square '>
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
                        type='email'
                        name='email'
                        className='p-2 border rounded-md disabled:cursor-not-allowed'
                        placeholder='Email'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                        value={credentials.email}
                        disabled={disableForm}
                        required
                    />
                    <input
                        type='password'
                        name='password'
                        className='p-2 border rounded-md disabled:cursor-not-allowed'
                        placeholder='Password'
                        value={credentials.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                        disabled={disableForm}
                        required
                    />
                </div>

                <button
                    type='submit'
                    className='p-1 bg-reddit-col rounded-full  text-white font-medium disabled:cursor-not-allowed'
                    disabled={disableForm}
                >
                    {isLoading ? <Spinner /> : 'Sign in'}
                </button>

                {isError ? <p >{error?.message}</p> : null}
            </form>

            <p className='flex items-center space-x-3'>
                <span> No account?</span>
                <Link href='/sign-up'>
                    <a className='text-blue-500 underline'>Sign up</a>
                </Link>
            </p>
        </div>
    </div>

}

