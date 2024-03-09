"use client"

import React from 'react';
import {signIn, signOut, useSession} from "next-auth/react";

export const SignInButton = () => {

    const {data: session} = useSession();

    if (session && session.user) {
        return (
            <div className="right-area header-action d-flex align-items-center max-un">
                <button type="button" className="login">
                    {session.user.name}
                </button>
                <a type="button" className="cmn-btn reg" onClick={() => {
                    signOut()
                }}>
                    Sign Out
                </a>
            </div>
        );
    }

    return (
        <div className="right-area header-action d-flex align-items-center max-un">
            <button type="button" className="cmn-btn reg" onClick={()=>{signIn('google')}}>
                Sign In
            </button>
        </div>
    )
};


