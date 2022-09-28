import Link from "next/link"
import { useRouter } from "next/router"
import { useSignUpEmailPassword } from "@nhost/nextjs"
import React, { useState } from "react"


const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const router = useRouter()

    const { signUpEmailPassword, isLoading, isSuccess, needsEmailVerification, isError, error } =
        useSignUpEmailPassword()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await signUpEmailPassword(email, password, { displayName: username })
        if (isSuccess)
            router.push("/sign-in")
    }
    if (isLoading)
        return <p>Loading...</p>
    return (
        <div>
            <form onSubmit={(e) => { handleSubmit(e) }}>
                <input
                    type="text" name="username" placeholder="Enter username"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
                <input
                    type="text" name="email" placeholder="Enter email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <input
                    type="password" name="password" placeholder="Enter password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                {/* errors */}
                <div>
                    {error?.message}
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp