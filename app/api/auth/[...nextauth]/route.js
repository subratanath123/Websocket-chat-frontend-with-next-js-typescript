import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async jwt({token, account}) {
            if (account) {
                token = Object.assign({}, token, { access_token: account.access_token });
            }
            return token
        },
        async session({session, token}) {
            if(session) {
                session = Object.assign({}, session, {access_token: token.access_token, picture: token.picture})
                 // console.log(session.access_token);
                 // console.log(token);
            }

            return session
        }
    }
});

export {
    handler as GET, handler as POST
}