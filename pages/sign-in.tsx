import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSignInEmailPassword } from '@nhost/nextjs'

export default function SignIn(): JSX.Element {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const { signInEmailPassword, isLoading, isSuccess, needsEmailVerification, isError, error } =
        useSignInEmailPassword()

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        await signInEmailPassword(email, password)
        console.log(isSuccess);

    }

    if (isSuccess) {
        router.push('/')
    }

    const disableForm = isLoading || needsEmailVerification

    return <div>
        <form onSubmit={(e) => handleOnSubmit(e)}>
            <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                disabled={disableForm}
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                disabled={disableForm}
                required
            />

            <button type="submit" disabled={disableForm} >
                {isLoading ? 'Loading' : 'Sign in'}
            </button>

            {isError ? <p >{error?.message}</p> : null}
        </form>


        <p className="flex items-center space-x-3">
            No account yet?
            <Link href="/sign-up">
                <a>Sign up</a>
            </Link>
        </p>
    </div>

}

