import axios, { AxiosRequestConfig } from "axios";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    debug: true, 
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),

        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async authorize(credentials, req) {
                const url = process.env.NEXT_PUBLIC_API_URL + 'auth'

                const config: AxiosRequestConfig = {
                    method: 'POST',
                    url,
                    data: {
                        email: credentials?.email,
                        password: credentials?.password
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }

                const user = await axios(config).then(res => res.data).catch(err => {
                    throw new Error(err.response.data.message)
                })

                return user
            }
        })
    ],


    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60 * 30 // 30 days
    },

    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },


    callbacks: {
        async session({ session, token }) {

            const url = process.env.NEXT_PUBLIC_API_URL + 'auth'

            const config: AxiosRequestConfig = {
                method: 'POST',
                url,
                data: {
                    name: session?.user?.name,
                    email: session?.user?.email,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token.accessToken
                }
            }

            const user = await axios(config).then(res => res.data)

            const { token: accessToken } = user

            return { ...session, ...token, accessToken }
        }
    },


}