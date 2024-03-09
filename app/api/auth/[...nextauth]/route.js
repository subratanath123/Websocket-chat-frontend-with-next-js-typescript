import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
// import { cookies } from 'next/headers'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async jwt({token, account}) {
            if (account) {
                token = Object.assign({}, token, {access_token: account.id_token});
                console.log(account?.id_token);
            }


            return token
        },
        async session({session, token}) {
            if (session) {
                session = Object.assign({}, session, {access_token: token.access_token, picture: token.picture})

                // console.log(token);
            }

            // cookies().set('Authorization', `Bearer ${token.access_token}`)

            return session
        }
    }
});

export {
    handler as GET, handler as POST
}