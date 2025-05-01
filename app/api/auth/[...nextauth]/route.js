import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import { signIn } from "next-auth/react";
// import { pages } from "next/dist/build/templates/app-page";

export const authOptions = {
    providers :[
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    secret : process.env.secret,
    pages:{
        signIn:'/login',
    }

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };